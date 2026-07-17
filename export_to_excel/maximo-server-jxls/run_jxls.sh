#!/bin/bash

MEE_HOME=$(cd "$(dirname "$0")" && pwd)

echo "=================================================="
echo "Maximo Server JXLS Exporter"
echo "=================================================="
echo "MEE_HOME=$MEE_HOME"
echo ""

LIB_DIR="$MEE_HOME/lib"
CONF_DIR="$MEE_HOME/conf"
OUTPUT_DIR="$MEE_HOME/output"

if [ ! -d "$OUTPUT_DIR" ]; then
    mkdir -p "$OUTPUT_DIR"
fi

echo "Running JXLS Export..."
java -jar "$LIB_DIR/maximo-server-jxls-1.0.0.jar" --config "$CONF_DIR/application.yml"

echo ""
echo "=================================================="
echo "JXLS Excel Export Completed!"
echo "Output Directory: $OUTPUT_DIR"
echo "=================================================="