# Probar en el celular

1. Conectá el celular por USB y aceptá la autorización de depuración si aparece.
2. En la carpeta del proyecto, ejecutá `npm run dev -- --host 127.0.0.1`.
3. En otra terminal, ejecutá `adb reverse tcp:5173 tcp:5173`.
4. En el celular abrí `http://127.0.0.1:5173`.
5. Probá el menú, el cambio English/Español, tema, desplazamiento y orientación horizontal. El enlace de idioma está en la cabecera y tiene pruebas de visibilidad en los 8 tamaños.

Si preferís Wi-Fi, usá `npm run dev -- --host 0.0.0.0` y abrí `http://<IPv4-de-la-PC>:5173` desde el celular conectado a la misma red. Si Windows pregunta, permití Node.js solo en redes privadas; no desactives el firewall. Para detener el servidor, presioná `Ctrl+C`.
