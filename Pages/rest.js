import { request } from "https://cdn.pika.dev/@octokit/request";
import { Octokit } from "https://cdn.pika.dev/@octokit/rest";

const octokit = new Octokit();

export async function GetYamlContent(owner, repo, path){
  return octokit.repos.getContent({
    owner: owner, 
    repo: repo,
    path: path
  }).then(result => {
    let content = buffer.Buffer.from(result.data.content, 'base64').toString();
    return jsyaml.load(content);
  }, e =>{
    return null;
  });
}
