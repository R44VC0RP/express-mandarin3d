import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { exec as execCallback } from 'child_process';
import util from 'util';
const exec = util.promisify(execCallback);

const findSkylineFiles = (directory) => {
    const files = fs.readdirSync(directory);
    return files.filter(file =>
        file.toLowerCase().endsWith('github-skyline.stl')
    );
};

const uploadFile = async (filePath) => {
    const spinner = ora('Uploading and processing file...').start();
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    const dev = 'prod';
    let endpoint;
    if (dev === 'dev') {
        endpoint = 'http://localhost:8080/api/submit-remote';
    } else {
        endpoint = 'https://backend.mandarin3d.com/api/submit-remote';
    }

    try {
        const response = await axios.post(endpoint,
            formData, {
                headers: {
                    ...formData.getHeaders()
                }
            }
        );
        spinner.succeed('Processing complete!');
        return response.data;
    } catch (error) {
        spinner.fail('Upload failed');
        spinner.info(`Error: ${error.response.data.details}`);
        throw new Error(`Upload failed: ${error.message}`);
    }
};

const installSkylineExtension = async () => {
    const spinner = ora('Installing GitHub Skyline extension...').start();
    try {
        await exec('gh extension install github/gh-skyline --force');
        spinner.succeed('GitHub Skyline extension installed successfully!');
    } catch (error) {
        spinner.fail('Failed to install GitHub Skyline extension');
        throw new Error('Failed to install GitHub Skyline extension');
    }
};

const generateSkyline = async () => {
    try {
        const { fullHistory } = await inquirer.prompt([{
            type: 'confirm',
            name: 'fullHistory',
            message: 'Would you like to generate your full GitHub history? (No will generate just this year)',
            default: false
        }]);

        const command = fullHistory ? 'gh skyline --full' : 'gh skyline';
        await exec(command);
    } catch (error) {
        if (error.message.includes('Command failed')) {
            await installSkylineExtension();
            const { fullHistory } = await inquirer.prompt([{
                type: 'confirm', 
                name: 'fullHistory',
                message: 'Would you like to generate your full GitHub history? (No will generate just this year)',
                default: false
            }]);
            
            const command = fullHistory ? 'gh skyline --full' : 'gh skyline';
            await exec(command);
        } else {
            throw error;
        }
    }
};

export async function main(args) {
    try {
        let filePath;

        // Check for --skyline flag
        if (args.includes('--skyline')) {
            // Search current directory
            let skylineFiles = findSkylineFiles(process.cwd());

            if (skylineFiles.length === 0) {
                console.log(chalk.blue('Attempting to generate GitHub Skyline...'));
                await generateSkyline();
                skylineFiles = findSkylineFiles(process.cwd());
                if (skylineFiles.length === 0) {
                    console.error(chalk.red('Failed to generate Skyline file'));
                    process.exit(1);
                }
            }

            if (skylineFiles.length === 1) {
                console.log(chalk.blue(`Using ${skylineFiles[0]} as the skyline file...`));
                filePath = path.join(process.cwd(), skylineFiles[0]);
            } else {
                // Prompt user to select file
                const { selectedFile } = await inquirer.prompt([{
                    type: 'list',
                    name: 'selectedFile',
                    message: 'Multiple skyline files found. Please select one:',
                    choices: skylineFiles
                }]);
                filePath = path.join(process.cwd(), selectedFile);
            }

            console.log(chalk.blue(`Preparing to upload ${path.basename(filePath)}...`));
            const result = await uploadFile(filePath);
            console.log(chalk.green('Upload successful!'));
            console.log(chalk.gray('\n🔗 View your quote at:'));
            console.log(chalk.cyan('  ' + result.url + '\n'));
            return;
        }

        // Handle non-skyline case
        if (args.length > 0 && !args[0].startsWith('--')) {
            // Use provided file path
            filePath = args[0];
            if (!fs.existsSync(filePath)) {
                console.error(chalk.red(`File not found: ${filePath}`));
                process.exit(1);
            }
        } else {
            console.error(chalk.red('No file path provided'));
            console.log(chalk.red('Usage: npx mandarin3d <stl file>'));
            console.log(chalk.red('   or: npx mandarin3d --skyline'));
            process.exit(1);
        }

        // Upload the file
        const result = await uploadFile(filePath);
        console.log(chalk.green('Upload successful!'));
        console.log(chalk.gray('\n🔗 View your quote at:'));
        console.log(chalk.cyan('  ' + result.url + '\n'));
        
    } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
    }
}