import { Injectable } from '@nestjs/common';
import { CreateVisualizeDto } from './dto/create-visualize.dto';
import { UpdateVisualizeDto } from './dto/update-visualize.dto';
import * as fs from 'fs';
import * as path from 'path';
import { VisualiseHelper } from './visualise.helper';

export interface VisualizationFile {
  name: string;
  path: string;
  url: string;
}

@Injectable()
export class VisualizeService {
  constructor(private readonly visualiseHelper: VisualiseHelper) { }

  create(createVisualizeDto: CreateVisualizeDto) {
    return 'This action adds a new visualize';
  }

  async processCsvFile(file: Express.Multer.File) {
    console.log('\n' + '='.repeat(60));
    console.log('📁 PROCESSING CSV FILE');
    console.log('='.repeat(60));
    try {
      console.log(`File received:`, {
        originalname: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      });
      // Read and parse the CSV file
      const fileContent = fs.readFileSync(file.path, 'utf8');

      // Parse CSV content
      const records = await this.visualiseHelper.parseCSV(fileContent);

      // Get basic information
      const headers = records.length > 0 ? Object.keys(records[0]) : [];
      const rowCount = records.length;
      const columnCount = headers.length;

      // Identify numeric columns for analysis
      const numericColumns = this.visualiseHelper.identifyNumericColumns(records, headers);

      // Get basic statistics for numeric columns
      const statistics = {};
      for (const col of numericColumns.slice(0, 5)) {
        const values = records.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
        if (values.length > 0) {
          statistics[col] = {
            mean: this.visualiseHelper.calculateMean(values),
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length
          };
        }
      }

      // Generate unique file ID from filename
      const fileId = path.basename(file.filename, path.extname(file.filename));
      // Get the filename without extension for folder name
      const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
      const cleanFileName = fileNameWithoutExt.replace(/[^a-zA-Z0-9\-_]/g, '');

      // Run Python visualization script
      console.log('🚀 Calling Python visualization script...');
      const pythonResult = await this.visualiseHelper.runPythonVisualization(file.path,cleanFileName);


      // Check if visualizations were generated
      const visualizationPath = path.join(process.cwd(), 'visualizations');
      const fileSpecificPath = path.join(visualizationPath, cleanFileName);
      let visualizationFiles: VisualizationFile[] = [];

      if (fs.existsSync(visualizationPath)) {
        visualizationFiles = fs.readdirSync(visualizationPath)
          .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
          .map(f => ({
            name: f,
            path: `/visualizations/${f}`,
            url: `http://localhost:3000/visualizations/${f}`
          }));
      }

      // Check if statistics.json was generated
      const statsPath = path.join(process.cwd(), 'statistics.json');
      let pythonStats = null;

      if (fs.existsSync(statsPath)) {
        pythonStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
      }

      return {
        success: true,
        message: 'File uploaded and processed successfully',
        file_id: fileId,
        file_path: file.path,
        filename: file.originalname,
        row_count: rowCount,
        column_count: columnCount,
        columns: headers,
        numeric_columns: numericColumns,
        statistics: statistics,
        python_statistics: pythonStats,
        size: file.size,
        mimetype: file.mimetype,
        python_visualization: pythonResult,
        visualization_files: visualizationFiles,
        visualization_base_url: `http://localhost:3000/visualizations/${cleanFileName}/`,
        has_visualizations: visualizationFiles.length > 0
      };

    } catch (error) {
      console.error('❌ Error processing CSV:', error);
      throw new Error(`Failed to process CSV file: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all visualize`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visualize`;
  }

  update(id: number, updateVisualizeDto: UpdateVisualizeDto) {
    return `This action updates a #${id} visualize`;
  }

  remove(id: number) {
    return `This action removes a #${id} visualize`;
  }
}