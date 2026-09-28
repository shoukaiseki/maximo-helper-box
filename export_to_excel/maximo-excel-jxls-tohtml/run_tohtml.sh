#!/bin/bash

MEE_HOME=$(cd "$(dirname "$0")" && pwd)

echo "=================================================="
echo "Maximo Excel JXLS to HTML Converter"
echo "=================================================="
echo "MEE_HOME=$MEE_HOME"
echo ""

LIB_DIR="$MEE_HOME/lib"
CONF_DIR="$MEE_HOME/conf"
OUTPUT_DIR="$MEE_HOME/output"

if [ ! -d "$OUTPUT_DIR" ]; then
    mkdir -p "$OUTPUT_DIR"
fi

if [ ! -f "$MEE_HOME/test_template.xls" ]; then
    echo "Generating demo template..."
    java -jar "$LIB_DIR/maximo-excel-jxls-tohtml-1.0.0.jar" --create-demo-template="$MEE_HOME/test_template.xls"
fi

echo "Running JXLS to HTML Export..."
java -jar "$LIB_DIR/maximo-excel-jxls-tohtml-1.0.0.jar" --config "$CONF_DIR/application.yml" --input="$MEE_HOME/test_input.json" --template="$MEE_HOME/test_template.xls" --output="$OUTPUT_DIR/demo.html"

echo ""
echo "=================================================="
echo "HTML Export Completed!"
echo "Output: $OUTPUT_DIR/demo.html"
echo "=================================================="