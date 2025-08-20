import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function RoomType({selectedRoomType}) {
    return (
        <div>
            <label className='text-slate-400'>Selecione o Tipo de Ambiente *</label>
            <Select onValueChange={(value)=>selectedRoomType(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo de Ambiente" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Living Room">Sala de Estar</SelectItem>
                    <SelectItem value="Bedroom">Quarto</SelectItem>
                    <SelectItem value="Children's Room">Quarto Infantil</SelectItem>
                    <SelectItem value="Baby Room">Quarto do Bebê</SelectItem>
                    <SelectItem value="Kitchen">Cozinha</SelectItem>
                    <SelectItem value="Office">Escritório</SelectItem>
                    <SelectItem value="Bathroom">Banheiro</SelectItem>
                    <SelectItem value="Backyard">Quintal</SelectItem>
                    <SelectItem value="Store">Loja</SelectItem>
                    <SelectItem value="Restaurant">Restaurante</SelectItem>
                    <SelectItem value="Facade">Fachada</SelectItem>
                    <SelectItem value="Dining Room">Sala de Jantar</SelectItem>
                    <SelectItem value="Laundry Room">Lavanderia</SelectItem>
                    <SelectItem value="Garage">Garagem</SelectItem>
                    <SelectItem value="Balcony">Varanda</SelectItem>
                    <SelectItem value="Closet">Closet</SelectItem>
                    <SelectItem value="Gym">Academia</SelectItem>
                    <SelectItem value="Workshop">Oficina</SelectItem>
                    <SelectItem value="Coffee Shop">Cafeteria</SelectItem>
                    <SelectItem value="Coworking Space">Coworking</SelectItem>
                    <SelectItem value="Hotel Lobby">Lobby de hotel</SelectItem>
                    <SelectItem value="Patio">Pátio externo</SelectItem>
                    <SelectItem value="Pool Area">Área da piscina</SelectItem>
                    <SelectItem value="Barbecue Area">Área de churrasqueira</SelectItem>
                    <SelectItem value="Meditation Room">Sala de meditação</SelectItem>
                    <SelectItem value="Wine Cellar">Adega</SelectItem>
                    <SelectItem value="Pantry">Despensa</SelectItem>
                    <SelectItem value="Bar">Bar</SelectItem>
                    <SelectItem value="Outdoor Balcony">Sacada externa</SelectItem>
                    <SelectItem value="Corridor">Corredor</SelectItem>
                </SelectContent>
            </Select>

        </div>
    )
}

export default RoomType