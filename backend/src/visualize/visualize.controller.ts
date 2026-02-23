import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { VisualizeService } from './visualize.service';
import { CreateVisualizeDto } from './dto/create-visualize.dto';
import { UpdateVisualizeDto } from './dto/update-visualize.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';


@Controller('visualize')
export class VisualizeController {
  constructor(private readonly visualizeService: VisualizeService) { }

  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        // Keep unique suffix for the stored file to avoid overwrites
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const originalName = file.originalname.replace(ext, '');
        const filename = `${originalName}-${uniqueSuffix}${ext}`;
        
        // Store the original name in a custom property for later use
        file['originalName'] = file.originalname;
        
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(csv)$/)) {
        return callback(new Error('Only CSV files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
  }))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    // Process the file and return response
    return this.visualizeService.processCsvFile(file);
  }

  @Post()
  create(@Body() createVisualizeDto: CreateVisualizeDto) {
    return this.visualizeService.create(createVisualizeDto);
  }

  // In your visualize.controller.ts - add this temporary endpoint

  // @Get('debug-python')
  // async debugPython() {
  //   try {
  //     // Check if uploads folder exists
  //     if (!fs.existsSync('uploads')) {
  //       return { error: 'Uploads folder does not exist' };
  //     }

  //     // Get all files in uploads folder
  //     const files = fs.readdirSync('uploads');

  //     if (files.length === 0) {
  //       return { error: 'No files found in uploads folder' };
  //     }

  //     // Get the latest file
  //     const latestFile = files
  //       .map(f => ({
  //         name: f,
  //         time: fs.statSync(`uploads/${f}`).mtime.getTime()
  //       }))
  //       .sort((a, b) => b.time - a.time)[0];

  //     const filePath = `uploads/${latestFile.name}`;
  //     console.log(`Debugging Python with file: ${filePath}`);

  //     // Check if file exists
  //     if (!fs.existsSync(filePath)) {
  //       return { error: `File not found: ${filePath}` };
  //     }

  //     console.log(`File size: ${fs.statSync(filePath).size} bytes`);

  //     const result = await this.visualizeService.runPythonVisualization(filePath);
  //     return result;

  //   } catch (error) {
  //     console.error('Debug endpoint error:', error);
  //     return {
  //       error: error.message,
  //       stack: error.stack
  //     };
  //   }
  // }

  @Get()
  findAll() {
    return this.visualizeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visualizeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisualizeDto: UpdateVisualizeDto) {
    return this.visualizeService.update(+id, updateVisualizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visualizeService.remove(+id);
  }
}