import { request } from "https://cdn.pika.dev/@octokit/request";
import { Octokit } from "https://cdn.pika.dev/@octokit/rest";

export async function GetYamlContent(path){
  return octokit.repos.getContent({
    owner: path.owner, 
    repo: path.repo,
    path: path.path
  }).then(result => {
    let content = buffer.Buffer.from(result.data.content, 'base64').toString();
    return jsyaml.load(content);
  }, e =>{
    return null;
  });
}
