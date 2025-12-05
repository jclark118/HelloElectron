#!/usr/bin/env node
/**
 * Downloads Linux x64 JRE from Adoptium if not already present
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const JRE_CONFIG = {
    url: 'https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.8+9/OpenJDK21U-jre_x64_linux_hotspot_21.0.8_9.tar.gz',
    archiveName: 'jdk-21.0.8+9-jre',
    archiveHash: '968c283e104059dae86ea1d670672a80170f27a39529d815843ec9c1f0fa2a03',
    destName: 'jre',
};

const SCRIPT_DIR = __dirname;

/**
 * Downloads a file from a URL, following redirects
 */
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        
        const request = (url) => {
            https.get(url, (response) => {
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    // Follow redirect
                    request(response.headers.location);
                    return;
                }
                
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download: ${response.statusCode}`));
                    return;
                }
                
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlinkSync(dest);
                reject(err);
            });
        };
        
        request(url);
    });
}

/**
 * Verifies SHA256 hash of a file
 */
function verifyHash(filePath, expectedHash) {
    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return hash === expectedHash;
}

/**
 * Extracts a .tar.gz file using system tar
 */
function extractTarGz(file, extractTo) {
    execSync(`tar -xzf "${file}" -C "${extractTo}"`, { stdio: 'inherit' });
}

/**
 * Checks if JRE is already installed
 */
function jreExists() {
    const javaBinPath = path.join(SCRIPT_DIR, JRE_CONFIG.destName, 'bin', 'java');
    return fs.existsSync(javaBinPath);
}

/**
 * Downloads and installs the JRE
 */
async function downloadJre() {
    const tempDir = path.join(SCRIPT_DIR, 'temp');
    const destPath = path.join(SCRIPT_DIR, JRE_CONFIG.destName);
    const tarFile = path.join(tempDir, 'jre.tar.gz');

    // Clean up existing directories
    if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
        console.log(`Deleted ${destPath}`);
    }
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    try {
        // Download
        console.log(`Downloading JRE from ${JRE_CONFIG.url}...`);
        await downloadFile(JRE_CONFIG.url, tarFile);
        console.log('Download complete.');

        // Verify hash
        console.log('Verifying checksum...');
        if (!verifyHash(tarFile, JRE_CONFIG.archiveHash)) {
            throw new Error('Checksum verification failed!');
        }
        console.log('Checksum verified.');

        // Extract
        console.log('Extracting...');
        extractTarGz(tarFile, tempDir);

        // Move to final location
        const extractedDir = path.join(tempDir, JRE_CONFIG.archiveName);
        fs.renameSync(extractedDir, destPath);
        console.log(`Installed JRE to ${destPath}`);

        // Set permissions
        const files = fs.readdirSync(destPath, { recursive: true });
        for (const file of files) {
            const filePath = path.join(destPath, file);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                fs.chmodSync(filePath, 0o755);
            }
        }
        console.log('Permissions set.');

    } finally {
        // Cleanup temp
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
            console.log('Cleaned up temp files.');
        }
    }
}

// Main
async function main() {
    if (jreExists()) {
        console.log('JRE already installed.');
    } else {
        console.log('JRE not found, downloading...');
        await downloadJre();
        console.log('JRE installation complete.');
    }
}

main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
