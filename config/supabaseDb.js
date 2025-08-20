import { supabase } from './supabaseConfig.js'

// Users table operations
export const UsersSupabase = {
  // Insert a new user
  async insert(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data
  },

  // Update user by email
  async update(email, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('email', email)
      .select()
    
    if (error) throw error
    return data
  },

  // Select user by email
  async selectByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
    
    if (error) throw error
    return data
  },

  // Select all users
  async selectAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) throw error
    return data
  }
}

// AI Generated Images table operations
export const AiGeneratedImageSupabase = {
  // Insert a new AI generated image
  async insert(imageData) {
    const { data, error } = await supabase
      .from('ai_generated_image')
      .insert([imageData])
      .select()
    
    if (error) throw error
    return data
  },

  // Select images by user email
  async selectByUserEmail(userEmail) {
    const { data, error } = await supabase
      .from('ai_generated_image')
      .select('*')
      .eq('user_email', userEmail)
      .order('id', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Select all images
  async selectAll() {
    const { data, error } = await supabase
      .from('ai_generated_image')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    return data
  }
  ,
  // Delete image by id (scoped to user email for safety)
  async deleteById(id, userEmail) {
    // Usar rota API para aplicar checagens adicionais
    const url = `/api/images/${id}?userEmail=${encodeURIComponent(userEmail||'')}`;
    const res = await fetch(url, { method: 'DELETE' });
    const data = await res.json().catch(()=>({}));
    if(!res.ok){
      throw new Error(data.error || 'Erro ao deletar');
    }
    return data;
  }
}
