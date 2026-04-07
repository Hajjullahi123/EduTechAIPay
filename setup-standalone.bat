REM Initialization Script for FinSchool Standalone
REM Run this once after 'npm install'

echo "--- Initialising Standalone Database ---"
npx --no-install prisma generate --schema=server/prisma/schema.prisma
npx --no-install prisma db push --force-reset --schema=server/prisma/schema.prisma
node server/prisma/seed.js
echo "--- Initialisation Complete ---"
echo "Start the App dev mode: npm run electron:dev"
