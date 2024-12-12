
# Mandarin3D CLI

A command-line tool to easily upload GitHub Skyline STL files to Mandarin3D for quotes and processing.

### Github Skyline Usage

First follow the instructions to generate a GitHub Skyline STL file.

The simple recap is:

1. Make sure you have `gh` installed.
2. Make sure you are logged into `gh` with `gh auth login`
3. Install the `gh-skyline` extension with `gh extension install github/gh-skyline` or `➜  Code gh extension install github/gh-skyline --force`

```
gh skyline 
```

That will generate a GitHub Skyline STL file in the current directory.

Then you can upload it and get a link for a checkout quote to Mandarin3D with the following command:

```bash
npx mandarin3d --skyline
```

You will then be prompted to confirm if you want to generate your full GitHub history or just this year.



## Usage

```bash
npx mandarin3d <stl file>
```
