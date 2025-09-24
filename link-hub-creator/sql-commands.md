# Comandos SQL para resolver problemas do Supabase

## 1. PRIMEIRO: Desabilitar triggers que estão causando erro

```sql
-- Verificar se existe algum trigger na tabela auth.users
SELECT * FROM information_schema.triggers WHERE event_object_table = 'users';

-- Se houver triggers, desabilitar temporariamente
-- (Execute este comando apenas se encontrar triggers acima)
-- ALTER TABLE auth.users DISABLE TRIGGER ALL;
```

## 2. SEGUNDO: Tornar username opcional na tabela profiles

```sql
-- Tornar o campo username nullable (para não dar erro de NOT NULL)
ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;

-- Definir um valor padrão para username
ALTER TABLE profiles ALTER COLUMN username SET DEFAULT 'user_temp';
```

## 3. TERCEIRO: Criar função para gerar username automaticamente

```sql
-- Função para gerar username baseado no email
CREATE OR REPLACE FUNCTION generate_username(email_input text)
RETURNS text AS $$
BEGIN
  RETURN COALESCE(
    regexp_replace(split_part(email_input, '@', 1), '[^a-zA-Z0-9_]', '_', 'g'),
    'user_' || extract(epoch from now())::text
  );
END;
$$ LANGUAGE plpgsql;
```

## 4. QUARTO: Criar trigger seguro para criação de perfil

```sql
-- Função que será executada quando um usuário for criado
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    bio,
    profile_picture_url,
    links,
    theme,
    socials,
    updated_at
  )
  VALUES (
    NEW.id,
    generate_username(NEW.email),
    'Bem-vindo ao Link Hub Creator!',
    '',
    '[]'::jsonb,
    '{
      "backgroundColor": "#ffffff",
      "linkColor": "#3b82f6",
      "linkFontColor": "#ffffff",
      "fontFamily": "Inter",
      "linkStyle": "filled",
      "linkColorHover": "#2563eb",
      "linkFontColorHover": "#ffffff"
    }'::jsonb,
    '{}'::jsonb,
    now()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Se der erro, não falha o signup, apenas loga o erro
    RAISE WARNING 'Could not create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 5. QUINTO: Recriar o trigger com tratamento de erro

```sql
-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar novo trigger seguro
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 6. SEXTO: Testar criando um usuário

Depois de executar os comandos acima, teste criar um usuário:

1. Vá para Authentication → Users
2. Clique em "Create new user"
3. Use email: `test@teste.com` e senha: `123456789`
4. Marque "Auto Confirm User"
5. Clique em "Create user"

Se funcionar, o signup na aplicação também vai funcionar!

---

## Como usar:

1. Abra o Supabase Dashboard
2. Vá em "SQL Editor"
3. Execute os comandos **na ordem** (um por vez)
4. Teste criar usuário no painel
5. Se funcionar, teste na aplicação