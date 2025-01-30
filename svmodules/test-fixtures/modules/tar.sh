#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to create tar for a module
create_module_tar() {
    local module_dir="$1"
    local module_name=$(basename "$module_dir")
    
    # Create tar.gz file in the current working directory
    tar -czf "./${module_name}.tgz" -C "$module_dir" \
        --exclude="*.tgz" \
        --exclude=".terraform" \
        --exclude=".terraform.lock.hcl" \
        --exclude="terraform.tfstate*" \
        .
    
    echo "Created ${module_name}.tgz in current directory"
}

# Find all immediate subdirectories in the modules folder
for module_dir in "$SCRIPT_DIR"/*/ ; do
    # Skip if it's not a directory
    [ -d "$module_dir" ] || continue
    
    # Skip the current directory if it contains this script
    if [ "$(basename "$module_dir")" != "$(dirname "$0")" ]; then
        create_module_tar "$module_dir"
    fi
done

echo "All module tarballs created successfully!"
