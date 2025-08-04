import { supabase } from '../config/supabaseClient';
import 'dotenv/config';

describe('Integração: Conexão e Schema do Supabase', () => {

  test('deve carregar as variáveis de ambiente', () => {
    expect(process.env.SUPABASE_URL).toBeDefined();
    expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
  });

  test('deve conectar ao Supabase e buscar dados da tabela "products"', async () => {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeInstanceOf(Array);
  });

  test('a tabela "products" deve ter as colunas corretas', async () => {
    const { data, error } = await supabase.from('products').select('*').limit(1);

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    
    if (data && data.length > 0) {
        const product = data[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('image_url');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('created_at');
    } else {
        console.warn('A tabela "products" está vazia. Não foi possível verificar as colunas.');
    }
  });

});
