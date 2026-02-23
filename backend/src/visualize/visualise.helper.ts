import { Injectable } from "@nestjs/common";
import { parse } from 'csv-parse';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VisualiseHelper {
    private execAsync = promisify(exec);

    async runPythonVisualization(filePath: string, folderName: string): Promise<any> {
        console.log('\n' + '='.repeat(60));
        console.log('🐍 PYTHON SCRIPT EXECUTION');
        console.log('='.repeat(60));

        try {
            // Get the absolute path to the Python script
            const scriptPath = path.join(process.cwd(), '..', 'scripts', 'visualize_csv.py');
            console.log(`📜 Script path: ${scriptPath}`);

            // Use python3 explicitly (not python)
            const pythonCommand = 'python3';
            console.log(`✅ Using: ${pythonCommand}`);

            // Check if script exists
            if (!fs.existsSync(scriptPath)) {
                console.error(`❌ Script not found at: ${scriptPath}`);
                return { success: false, error: 'Python script not found' };
            }

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.error(`❌ File not found: ${filePath}`);
                return { success: false, error: 'CSV file not found' };
            }

            console.log(`📁 File exists: ${filePath} (${fs.statSync(filePath).size} bytes)`);
            console.log(`📁 Output folder: ${folderName}`);

            // Run the Python script with folderName parameter
            console.log(`\n🚀 Executing: ${pythonCommand} "${scriptPath}" "${filePath}" "${folderName}"`);

            const { stdout, stderr } = await this.execAsync(
                `${pythonCommand} "${scriptPath}" "${filePath}" "${folderName}"`
            );

            console.log('✅ Python script executed successfully');
            console.log('📤 STDOUT:');
            console.log('-'.repeat(40));
            console.log(stdout);
            console.log('-'.repeat(40));

            if (stderr) {
                console.log('⚠️ STDERR:');
                console.log('-'.repeat(40));
                console.log(stderr);
                console.log('-'.repeat(40));
            }

            // Try to parse JSON output
            try {
                // Look for JSON in the output (between curly braces)
                const jsonMatch = stdout.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const jsonOutput = JSON.parse(jsonMatch[0]);
                    console.log('📊 Parsed JSON output:', jsonOutput);
                    return { success: true, output: jsonOutput };
                }
            } catch (e) {
                console.log('⚠️ Could not parse JSON from output');
            }

            return { success: true, output: stdout };

        } catch (error) {
            console.error('❌ Failed to run Python script:', error);
            return {
                success: false,
                error: error.message,
                details: 'Make sure Python3 is installed: sudo apt install python3 python3-pip'
            };
        }
    }

    public parseCSV(csvContent: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            parse(csvContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            }, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records);
                }
            });
        });
    }

    public identifyNumericColumns(records: any[], headers: string[]): string[] {
        const numericColumns: string[] = [];

        for (const header of headers) {
            const sampleSize = Math.min(100, records.length);
            let numericCount = 0;

            for (let i = 0; i < sampleSize; i++) {
                const value = records[i][header];
                if (value && !isNaN(parseFloat(value)) && isFinite(value)) {
                    numericCount++;
                }
            }

            if (numericCount / sampleSize > 0.8) {
                numericColumns.push(header);
            }
        }

        return numericColumns;
    }

    public calculateMean(values: number[]): number {
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }
}