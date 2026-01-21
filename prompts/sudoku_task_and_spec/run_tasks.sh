agent=$(toml get tasks.agent --toml-path config/config.toml)

sh scripts/run_tasks_$agent.sh
