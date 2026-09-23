const BASE_URL = 'https://fakestoreapi.com';

// Captura de argumentos pasados desde la terminal
const [, , method, path, ...extraArgs] = process.argv;

async function main() {
  if (!method || !path) {
    console.log('   Uso incorrecto. Formatos admitidos:');
    console.log('   npm run start GET products');
    console.log('   npm run start GET products/<id>');
    console.log('   npm run start POST products <title> <price> <category>');
    console.log('   npm run start DELETE products/<id>');
    return;
  }

  const normalizedMethod = method.toUpperCase();

  try {
    switch (normalizedMethod) {
      case 'GET':
        await handleGet(path);
        break;

      case 'POST':
        await handlePost(path, extraArgs);
        break;

      case 'DELETE':
        await handleDelete(path);
        break;

      default:
        console.log(`Método no soportado: ${method}`);
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
  }
}

// GET products o GET products/:id
async function handleGet(path) {
  const response = await fetch(`${BASE_URL}/${path}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  console.log('Respuesta de la API:');
  console.dir(data, { depth: null, colors: true });
}

// POST products <title> <price> <category>
async function handlePost(path, args) {
  const [title, price, category] = args;

  const numericPrice = Number(price);

  if (!title || !price || !category || Number.isNaN(numericPrice)) {
    console.log('Faltan argumentos o el precio no es válido.');
    console.log(
      '   Ejemplo: npm run start POST products T-Shirt-Rex 300 remeras'
    );
    return;
  }

  const newProduct = {
    title,
    price: numericPrice,
    category
  };

  const response = await fetch(`${BASE_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProduct)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  console.log('Producto creado exitosamente:');
  console.log(data);
}

// DELETE products/:id
async function handleDelete(path) {
  const response = await fetch(`${BASE_URL}/${path}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  console.log('Producto eliminado:');
  console.log(data);
}

main();
