import sys
import os
import re
import tomllib
import subprocess
from pathlib import Path

if len(sys.argv) < 2:
    print("usage:")
    print("agent <prompt_file>")
    print("python agent.py <prompt_file>")
    sys.exit(0)

rerun = False
if "--rerun" in sys.argv:
    rerun = True

with open("config.toml", "rb") as f:
    config = tomllib.load(f)

prompt_cache_directory = config["promptcache"]["directory"]
agent = config["codegen"]["agent"]
mode = config["agent"][agent]["mode"]
model = config["agent"][agent]["model"]
python_version = config["python"]["version"]

prompt_file = sys.argv[1]
prompt_file_basename = os.path.basename(prompt_file)
prompt_file_dir = os.path.abspath(os.path.dirname(prompt_file))

with open(prompt_file, "r") as f:
    prompt_file_content = f.read()

current_directory = os.path.dirname(os.path.abspath(__file__))
prompt_base_directory = os.path.join(current_directory, "prompts") + "/"
prompt_non_base_directory = prompt_file_dir.replace(prompt_base_directory, "")

if prompt_non_base_directory == prompt_file_dir:
    prompt_non_base_directory = ""

prompt_file_fullpath_in_cache_directory = os.path.join(current_directory, prompt_cache_directory, prompt_non_base_directory)
prompt_file_fullpath_in_cache = os.path.join(current_directory, prompt_cache_directory, prompt_non_base_directory, prompt_file_basename)
prompt_file_fullpath_in_cache_script = os.path.join(current_directory, prompt_cache_directory, prompt_non_base_directory, prompt_file_basename + ".py")
prompt_file_fullpath_in_cache_output = os.path.join(current_directory, prompt_cache_directory, prompt_non_base_directory, prompt_file_basename + ".output")

os.makedirs(prompt_file_fullpath_in_cache_directory, exist_ok=True)
os.makedirs(os.path.dirname(prompt_file_fullpath_in_cache), exist_ok=True)

pattern_regex = r"@context\((.*?)\)"
matches = re.finditer(pattern_regex, prompt_file_content)
for match in matches:
    pattern = match.group(0)
    context_file = match.group(1).strip("'\"")
    context_file = os.path.join(prompt_file_dir, context_file)
    with open(context_file, "r") as f:
        context_file_content = f.read()
    prompt_file_content = prompt_file_content.replace(pattern, "", 1)
    prompt_file_content = context_file_content + "\n" + prompt_file_content

prompt_file_content = prompt_file_content.strip()

prompt_file_content_in_cache = ""
if os.path.exists(prompt_file_fullpath_in_cache):
    with open(prompt_file_fullpath_in_cache, "r") as f:
        prompt_file_content_in_cache = f.read()

if not rerun:
    if prompt_file_content == prompt_file_content_in_cache:
        if os.path.exists(prompt_file_fullpath_in_cache_script):
            subprocess.run([f"python{python_version}", prompt_file_fullpath_in_cache_script])
            sys.exit(1)

realtime_prompt_path = os.path.join(prompt_cache_directory, "_realtime_prompt.prompt")
with open(realtime_prompt_path, "w") as f:
    f.write(prompt_file_content)

with open(prompt_file_fullpath_in_cache, "w") as f:
    f.write(prompt_file_content)

if mode == "cli":
    command = config["agent"][agent]["command"]
    command = command.replace("<model>", model)
    command = command.replace("<version>", str(python_version))
    command = command.replace("<prompt_file_content>", prompt_file_content)
    command = command.replace("<prompt_file_fullpath_in_cache>", prompt_file_fullpath_in_cache)
    
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    prompt_output = result.stdout
    
    with open(prompt_file_fullpath_in_cache_output, "w") as f:
        f.write(prompt_output)
    
    prompt_output = prompt_output.strip()
    
    is_python_script = False
    non_python_runtime = ""
    
    lines = prompt_output.split("\n")
    first_line_of_prompt_output = lines[0] if lines else ""
    
    if first_line_of_prompt_output.startswith("```"):
        if first_line_of_prompt_output.startswith("```python"):
            is_python_script = True
        else:
            non_python_runtime = first_line_of_prompt_output.replace("```", "").strip()
        
        lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        prompt_output = "\n".join(lines).strip()
    
    if lines and lines[-1] == "```":
        lines = lines[:-1]
        prompt_output = "\n".join(lines).strip()
    
    realtime_codeblock_path = os.path.join(prompt_cache_directory, "_realtime_prompt.codeblock")
    with open(realtime_codeblock_path, "w") as f:
        f.write(prompt_output)
    
    if not is_python_script:
        with open(realtime_codeblock_path, "r") as f:
            prompt_output = f.read()
        prompt_output = f'print("""{prompt_output}""")'
    
    realtime_script_path = os.path.join(prompt_cache_directory, "_realtime_prompt_script.py")
    with open(realtime_script_path, "w") as f:
        f.write(prompt_output)
    
    with open(prompt_file_fullpath_in_cache_script, "w") as f:
        f.write(prompt_output)
    
    try:
        if is_python_script:
            process = subprocess.Popen([f"python{python_version}", prompt_file_fullpath_in_cache_script], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
            realtime_output_path = os.path.join(prompt_cache_directory, "_realtime_prompt.output")
            with open(realtime_output_path, "w") as outfile:
                for line in process.stdout:
                    print(line, end="")
                    outfile.write(line)
            process.wait()
        else:
            result = subprocess.run([f"python{python_version}", realtime_script_path], capture_output=True, text=True)
            prompt_output = result.stdout
            realtime_output_path = os.path.join(prompt_cache_directory, "_realtime_prompt.output")
            with open(realtime_output_path, "w") as f:
                f.write(prompt_output)
            subprocess.run([non_python_runtime, realtime_output_path])
    except Exception as error:
        print(str(error))

