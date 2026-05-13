{
  "permissions": {
    "defaultMode": "auto",
    "allow": [
      "Bash",
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep",
      "WebFetch",
      "WebSearch"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)"
    ]
  }
}


---

{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": [],
    "deny": []
  }
}
