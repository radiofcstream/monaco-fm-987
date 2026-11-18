MONACO FM 98.7 — PROYECTO NETLIFY

1) Subí el contenido de esta carpeta a un repositorio GitHub.
2) En Netlify: Add new site > Import an existing project > elegí el repositorio.
3) Build command: npm run build
   Publish directory: public
   Netlify detecta netlify.toml y la función automáticamente.
4) En Site configuration > Environment variables agregá:
   NEWS_ADMIN_PASSWORD = tu contraseña de administración
   SESSION_SECRET = una cadena aleatoria larga (mínimo 32 caracteres)
5) En Deploys > Trigger deploy > Clear cache and deploy site.

IMÁGENES
Copiá tus PNG a public/assets/ con estos nombres exactos:
  nomaco.png
  portada1.png
  portada2.png
  portada3.png
  portada4.png

Si todavía no tenés las imágenes, la página muestra un logo de texto como alternativa.
Las portadas rotan cada 5 segundos. El logo nomaco se usa como logo de cabecera, perfil,
favicon y acceso de instalación.

ADMINISTRACIÓN
El botón azul discreto está en la esquina superior derecha. Ingresá con la contraseña
configurada en NEWS_ADMIN_PASSWORD. Desde el panel podés crear, editar y eliminar noticias
y programas. Los datos se guardan en Netlify Blobs y quedan publicados para todos.
La descripción y la foto de los programas son opcionales.

RADIO
Se configura el proxy HTTPS /radio-stream hacia:
http://uk2freenew.listen2myradio.com:29986/stream
El proxy se ejecuta como Netlify Edge Function. La disponibilidad depende de que el
proveedor de streaming permita conexiones salientes desde Netlify y entregue audio compatible.
Si el proveedor bloquea el proxy, se deberá pedir una URL HTTPS oficial al proveedor.

COMPARTIR E INSTALAR
El botón Compartir usa el menú nativo del teléfono cuando está disponible y, si no,
copia el enlace. La instalación PWA depende del navegador, HTTPS y de que se cumplan
sus criterios de instalación.

SEGURIDAD
No publiques la contraseña dentro de HTML o JavaScript. La contraseña se lee únicamente
desde NEWS_ADMIN_PASSWORD en Netlify. SESSION_SECRET debe ser privado y único.
El botón oculto no es una medida de seguridad: la autenticación real la valida la función.
