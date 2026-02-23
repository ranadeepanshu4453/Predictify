#!/usr/bin/env python3
"""
CSV Visualization Script
Run: python visualize_csv.py <path-to-csv-file> [chart-type]
"""

import sys
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
from pathlib import Path

def load_csv(file_path):
    """Load CSV file and return DataFrame"""
    try:
        df = pd.read_csv(file_path)
        print(f"✅ Successfully loaded: {file_path}")
        print(f"📊 Shape: {df.shape[0]} rows × {df.shape[1]} columns")
        print(f"📋 Columns: {', '.join(df.columns)}")
        return df
    except Exception as e:
        print(f"❌ Error loading CSV: {e}")
        sys.exit(1)

def show_basic_info(df):
    """Display basic information about the dataset"""
    print("\n" + "="*50)
    print("BASIC INFORMATION")
    print("="*50)
    print(df.info())
    
    print("\n" + "="*50)
    print("FIRST 5 ROWS")
    print("="*50)
    print(df.head())
    
    print("\n" + "="*50)
    print("STATISTICAL SUMMARY")
    print("="*50)
    print(df.describe())

def create_visualizations(df, chart_type='all', filename_prefix=''):
    """Create various visualizations based on the data"""
    
    # Get the current directory (scripts folder)
    current_dir = Path(__file__).parent.absolute()
    project_root = current_dir.parent
    backend_dir = project_root / 'backend'
    
    # Create filename-specific folder
    if backend_dir.exists():
        # Create visualizations/filename folder
        output_dir = backend_dir / 'visualizations' / filename_prefix
    else:
        output_dir = project_root / 'visualizations' / filename_prefix
    
    # Create output directory for charts
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Saving visualizations to: {output_dir}")
    
    # Get numeric columns
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    
    if not numeric_cols:
        print("❌ No numeric columns found for visualization")
        return []
    
    print(f"\n📈 Creating visualizations...")
    generated_files = []
    
    # 1. Distribution Plot (Histogram)
    if chart_type in ['all', 'histogram']:
        for col in numeric_cols[:3]:
            try:
                plt.figure(figsize=(10, 6))
                sns.histplot(data=df, x=col, kde=True, bins=30)
                plt.title(f'Distribution of {col}')
                plt.xlabel(col)
                plt.ylabel('Frequency')
                plt.tight_layout()
                filename = f'histogram_{col}.png'
                plt.savefig(output_dir / filename, dpi=100)
                plt.close()
                generated_files.append(filename)
                print(f"  ✅ Histogram saved: {filename}")
            except Exception as e:
                print(f"  ⚠️ Failed to create histogram for {col}: {e}")
    
    # 2. Correlation Heatmap
    if chart_type in ['all', 'correlation'] and len(numeric_cols) > 1:
        try:
            plt.figure(figsize=(12, 8))
            correlation_matrix = df[numeric_cols].corr()
            sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, fmt='.2f')
            plt.title('Correlation Heatmap')
            plt.tight_layout()
            filename = 'correlation_heatmap.png'
            plt.savefig(output_dir / filename, dpi=100)
            plt.close()
            generated_files.append(filename)
            print(f"  ✅ Correlation heatmap saved")
        except Exception as e:
            print(f"  ⚠️ Failed to create correlation heatmap: {e}")
    
    # 3. Pair Plot
    if chart_type in ['all', 'pairplot'] and len(numeric_cols) <= 5 and len(numeric_cols) > 1:
        try:
            plt.figure(figsize=(15, 15))
            sns.pairplot(df[numeric_cols])
            filename = 'pairplot.png'
            plt.savefig(output_dir / filename, dpi=100)
            plt.close()
            generated_files.append(filename)
            print(f"  ✅ Pairplot saved")
        except Exception as e:
            print(f"  ⚠️ Failed to create pairplot: {e}")
    
    # 4. Box Plots
    if chart_type in ['all', 'boxplot']:
        for col in numeric_cols[:4]:
            try:
                plt.figure(figsize=(10, 6))
                sns.boxplot(y=df[col])
                plt.title(f'Box Plot of {col}')
                plt.ylabel(col)
                plt.tight_layout()
                filename = f'boxplot_{col}.png'
                plt.savefig(output_dir / filename, dpi=100)
                plt.close()
                generated_files.append(filename)
                print(f"  ✅ Box plot saved: {filename}")
            except Exception as e:
                print(f"  ⚠️ Failed to create box plot for {col}: {e}")
    
    # 5. Time Series Plot (if date column exists)
    if chart_type in ['all', 'timeseries']:
        date_cols = df.select_dtypes(include=['object']).columns
        for col in date_cols:
            try:
                # Try to convert to datetime
                df[col] = pd.to_datetime(df[col], errors='coerce')
                if df[col].notna().any() and len(numeric_cols) > 0:
                    plt.figure(figsize=(15, 6))
                    for num_col in numeric_cols[:2]:
                        plt.plot(df[col], df[num_col], label=num_col, marker='o', markersize=3, alpha=0.6)
                    plt.title('Time Series Analysis')
                    plt.xlabel(col)
                    plt.ylabel('Values')
                    plt.legend()
                    plt.grid(True, alpha=0.3)
                    plt.tight_layout()
                    filename = 'timeseries.png'
                    plt.savefig(output_dir / filename, dpi=100)
                    plt.close()
                    generated_files.append(filename)
                    print(f"  ✅ Time series plot saved")
                    break
            except Exception as e:
                continue
    
    print(f"\n✅ Created {len(generated_files)} visualizations")
    return generated_files

def export_statistics(df, output_file='statistics.json', filename_prefix=''):
    """Export statistics to JSON file"""
    # Get the current directory (scripts folder)
    current_dir = Path(__file__).parent.absolute()
    project_root = current_dir.parent
    backend_dir = project_root / 'backend'
    
    # Determine output path - save inside filename-specific folder
    if backend_dir.exists():
        output_dir = backend_dir / 'visualizations' / filename_prefix
    else:
        output_dir = project_root / 'visualizations' / filename_prefix
    
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / output_file
    
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    
    stats = {
        'shape': {
            'rows': int(df.shape[0]),
            'columns': int(df.shape[1])
        },
        'columns': list(df.columns),
        'numeric_columns': numeric_cols,
        'statistics': {}
    }
    
    for col in numeric_cols:
        stats['statistics'][col] = {
            'mean': float(df[col].mean()) if not df[col].isna().all() else 0,
            'median': float(df[col].median()) if not df[col].isna().all() else 0,
            'min': float(df[col].min()) if not df[col].isna().all() else 0,
            'max': float(df[col].max()) if not df[col].isna().all() else 0,
            'std': float(df[col].std()) if not df[col].isna().all() else 0
        }
    
    with open(output_path, 'w') as f:
        json.dump(stats, f, indent=2)
    
    print(f"\n✅ Statistics exported to '{output_path}'")
    
    # Return stats as JSON string for NestJS to parse
    return json.dumps(stats)

def main():
    # Check command line arguments
    if len(sys.argv) < 2:
        print("Usage: python visualize_csv.py <path-to-csv-file> [chart-type]")
        print("  chart-type: all, histogram, correlation, pairplot, boxplot, timeseries")
        print("\nExample:")
        print("  python visualize_csv.py data.csv")
        print("  python visualize_csv.py data.csv histogram")
        sys.exit(1)
    
    # Get file path
    file_path = sys.argv[1]
    
    # Get chart type (default: all)
    chart_type = sys.argv[2] if len(sys.argv) > 2 else 'all'
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        sys.exit(1)
    
    # Extract filename without extension to use as folder name
    file_name = os.path.basename(file_path)
    filename_prefix = os.path.splitext(file_name)[0]
    # Clean filename to be safe for folder names
    filename_prefix = "".join(c for c in filename_prefix if c.isalnum() or c in (' ', '-', '_')).rstrip()
    
    print(f"\n🚀 Starting CSV Visualization")
    print(f"📁 File: {file_path}")
    print(f"📁 Output folder: {filename_prefix}")
    print(f"📊 Chart Type: {chart_type}")
    
    # Load CSV
    df = load_csv(file_path)
    
    # Show basic info
    show_basic_info(df)
    
    # Create visualizations
    generated_files = create_visualizations(df, chart_type, filename_prefix)
    
    # Export statistics and get JSON
    stats_json = export_statistics(df, 'statistics.json', filename_prefix)
    
    # Prepare result with folder structure info
    result = {
        "success": True,
        "file_processed": file_path,
        "output_folder": filename_prefix,
        "visualizations_created": generated_files,
        "visualization_count": len(generated_files),
        "statistics": json.loads(stats_json) if stats_json else {}
    }
    
    # Print JSON for NestJS to parse
    print("\n" + "="*50)
    print("FINAL RESULT (JSON for NestJS):")
    print("="*50)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()