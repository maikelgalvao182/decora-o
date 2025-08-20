import { UsersSupabase } from "@/config/supabaseDb";
import { NextResponse } from "next/server";

export async function POST(req){
    const {user}=await req.json();

    try{
        //If User Already Exist?
        const userInfo = await UsersSupabase.selectByEmail(user?.primaryEmailAddress.emailAddress);
        console.log("User",userInfo);
    
        //If Not Will Add New User to DB
        if(userInfo?.length == 0) {
            const newUser = {
                name: user?.fullName,
                email: user?.primaryEmailAddress.emailAddress,
                image_url: user?.imageUrl,
                credits: 3
            };

            const saveResult = await UsersSupabase.insert(newUser);
            return NextResponse.json({'result': saveResult[0]});
        }
        
        return NextResponse.json({'result': userInfo[0]});
    }
    catch(e){
        console.error('Error in verify-user API:', e);
        return NextResponse.json({error: e.message});
    }
}