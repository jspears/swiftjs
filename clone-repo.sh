#!/usr/bin/env bash
set -x
script_folder="$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)"
workspaces_folder="$(cd "${script_folder}/.." && pwd)"
clone_repo()
{
    cd "${workspaces_folder}"
    if [ ! -d "${1#*/}" ]; then
       if [ -n "$2" ]; then
            echo "sparse clone $1 $2"
            git_sparse_clone "https://github.com/$1" $2 $3
       else
        git clone "https://github.com/$1"
       fi 
    else 
        echo "Already cloned $1"
    fi
}

 git_sparse_clone() (
  rurl="${1//#*}" 
  localdir="${2}";
  branch=${1##*#}
  branch=${branch:-main}
  shift 2

  mkdir -p "$localdir"
  cd "$localdir"

  git init
  git remote add -f origin "$rurl"

  git config core.sparseCheckout true

  # Loops over remaining args
  for i; do
    echo "$i" >> .git/info/sparse-checkout
  done

  git pull origin ${branch}
)


if [ "${CODESPACES}" = "true" ]; then
    # Remove the default credential helper
    [ -f /etc/gitconfig ] && sudo sed -i -E 's/helper =.*//' /etc/gitconfig

    # Add one that just uses secrets available in the Codespace
    git config --global credential.helper '!f() { sleep 1; echo "username=${GITHUB_USER}"; echo "password=${GH_TOKEN}"; }; f'
fi

if [ -f "${script_folder}/repos-to-clone.list" ]; then
    grep -v '#' "${script_folder}/repos-to-clone.list" | while IFS=' ' read -r repository subdir sparse; do
        clone_repo "$repository" "$subdir" "$sparse"
    done 
fi