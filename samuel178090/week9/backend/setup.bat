@echo off
echo Setting up LegacyBridge Backend...
npm install
npm run build
echo.
echo Backend setup complete!
echo.
echo To start the server:
echo npm run dev
echo.
echo To run tests:
echo npm run test:coverage