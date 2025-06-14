const fs = require('fs');
const path = require('path');

async function readDirs(req, res) {
    try {
        const dir = path.join(__dirname, 'graphics-img');
        const files = await fs.promises.readdir(dir);

        // Si no hay archivos, redirecciona y detiene la ejecución
        if (files.length === 0) {
            return;
        }

        // Obtener información de los archivos de forma asíncrona
        let filesWithStats = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(dir, file);
                const stats = await fs.promises.stat(filePath);
                return { file, time: stats.mtime, path: filePath };
            })
        );

        // Ordenar archivos por fecha de modificación (más recientes primero)
        filesWithStats.sort((a, b) => b.time - a.time);

        // Mantener solo los dos archivos más recientes
        const filesToDelete = filesWithStats.slice(0);

        if(files.length > 15){
            await Promise.all(
                filesToDelete.map(({ path, file }) =>
                    fs.promises.unlink(path).then(() => console.log(`Archivo eliminado: ${file}`))
                )
            );
        }
    } catch (error) {
        console.error('Error en readDirs:', error.message);
    }
}

module.exports = readDirs;
