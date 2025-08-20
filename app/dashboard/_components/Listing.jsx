"use client"
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import EmptyState from './EmptyState';
import Link from 'next/link';
import { AiGeneratedImageSupabase } from '@/config/supabaseDb';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RoomDesignCard from './RoomDesignCard';
import { useRouter } from 'next/navigation';

function Listing() {
    const { user } = useUser();
    const router = useRouter();
    const [userRoomList, setUserRoomList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingDeleteRoom, setPendingDeleteRoom] = useState(null);
    useEffect(()=>{
        user&&GetUserRoomList();
    },[user])

    const GetUserRoomList=async()=>{
        setLoading(true);
        try {
            const result = await AiGeneratedImageSupabase.selectByUserEmail(
                user?.primaryEmailAddress?.emailAddress
            );
            
            setUserRoomList(result);
            console.log('Supabase result:', result);
        } catch (error) {
            console.error('Error fetching user room list:', error);
            setUserRoomList([]);
        } finally {
            setLoading(false);
        }
    }
    const requestDelete = (room)=>{
        setPendingDeleteRoom(room);
        setDialogOpen(true);
    }

    const handleConfirmDelete = async ()=>{
        const room = pendingDeleteRoom;
        if(!room?.id) { setDialogOpen(false); return; }
        try {
            setDeletingId(room.id);
            await AiGeneratedImageSupabase.deleteById(room.id, user?.primaryEmailAddress?.emailAddress);
            setUserRoomList(prev=>prev.filter(r=>r.id!==room.id));
        } catch (e) {
            console.error(e);
            alert('Erro ao deletar.');
        } finally {
            setDeletingId(null);
            setDialogOpen(false);
            setPendingDeleteRoom(null);
        }
    }

    return (
        <div>
            <div className='flex items-center justify-between'>
                <h2 className='font-bold text-3xl'>Olá, {user?.fullName}</h2>
                <Link href={'/dashboard/create-new'}>
                    <Button>+ Criar Design</Button>
                </Link>
            </div>


            {loading ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="relative">
                        <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin"></div>
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                </div>
            ) : userRoomList?.length == 0 ?
                <EmptyState />
                :
                <div className='mt-6'>
                    <h2 className='font-medium text-gray-600 text-xs mb-4'>Recentes</h2>
                    {/* Listing  */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {userRoomList.map((room,index)=>{
                            const org = room.orgImage || room.org_image;
                            const ai = room.aiImage || room.ai_image;
                            const roomType = room.roomType || room.room_type;
                            const designType = room.designType || room.design_type;
                            const params = new URLSearchParams();
                            if (org) params.set('orgImage', org);
                            if (ai) params.set('aiImage', ai);
                            if (roomType) params.set('roomType', roomType);
                            if (designType) params.set('designType', designType);
                            if (room.id) params.set('id', room.id);
                            return (
                                <div key={index} onClick={()=>{
                                    router.push(`/dashboard/result?${params.toString()}`)
                                }}>
                                                                        <RoomDesignCard 
                                                                                room={room} 
                                                                                onDelete={requestDelete} 
                                                                                deleting={deletingId===room.id}
                                                                        />
                                </div>
                            )
                        })}
                                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Excluir design?</DialogTitle>
                                                            <DialogDescription>
                                                                Esta ação não pode ser desfeita. O design será removido definitivamente.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={()=>{ setDialogOpen(false); setPendingDeleteRoom(null); }} disabled={!!deletingId}>Cancelar</Button>
                                                            <Button variant="destructive" onClick={handleConfirmDelete} disabled={!!deletingId}>
                                                                {deletingId? 'Excluindo...' : 'Excluir'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                        
                    </div>
                </div>
            }
        </div>
    )
}

export default Listing