// <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.14.0/js-yaml.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"></script>
// <script src="https://bundle.run/buffer"></script>

import { request } from "https://cdn.skypack.dev/@octokit/request";
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

export function MarkdownToYaml(src){
  const regExp = /```([^)]+)```/gm;
  let matches = regExp.exec(src);
  if(matches != null){ 
    return jsyaml.load(matches[1]);
  }else{
    return null;
  }
}

export class GithubREST {

  constructor(token) {
    if(token != null){
      this.octokit = new Octokit();
    }else{
      this.octokit = new Octokit({
        auth: token
      });
    }
  }
  
  changeAuth(accessToken) {
    octokit.authenticate({
      type: 'token',
      token: accessToken,
    });
  }

  async asyncRequest() {
    const result = await request({
      method: "GET",
    });
    console.log(result.data);
  }
  
  async asyncGetIssuesFromTitle(owner, repo, title) {
    return this.octokit.search.issuesAndPullRequests({
      q : title + ' in:title type:issue',
    }).then(response => {
      return response.data.items;
    }).catch(err => console.error(err));
  }
  
  async asyncMergeIssueYaml(owner, repo, issue){
    var dst = MarkdownToYaml(issue.body);
    if(dst == null){
      return null;
    }else{
      await octokit.issues.listComments({
        owner: owner, 
        repo: repo,
        issue_number : issue.number
      }).then(comments => {
        comments.data.forEach(element => {
          let yaml = MarkdownToYaml(element.body);
          if(yaml != null) _.merge(dst, yaml);
        });
      });
      return dst;
    }
  }
  
  async asyncGetIssueYamlFromTitle(owner, repo, title){
    let issues = await this.asyncGetIssuesFromTitle(owner, repo, title)
    if(issues.length != 1){
      console.log("err");
      console.log(issues);
      return null;
    }else{
      console.log("url : " + issues[0].html_url);
      var dst = await this.asyncMergeIssueYaml(owner, repo, issues[0]);
      _.merge(dst, {
        url : issues[0].html_url
      });
      return dst;
    }
  }

  async asyncGetIssuesFromTitle(owner, repo, title) {
    return this.octokit.search.issuesAndPullRequests({
      q : title + ' in:title type:issue',
    }).then(response => {
      return response.data.items;
    }).catch(err => console.error(err));
  }
  
  async asyncGetContent(owner, repo, path){
    return this.octokit.repos.getContent({
      owner: owner, 
      repo: repo,
      path: path
    }).then(result => {
      return buffer.Buffer.from(result.data.content, 'base64').toString();
    }, e =>{
      return null;
    });
  }

  async asyncGetContentToYaml(owner, repo, path){
    let dst = await this.asyncGetContent(owner, repo, path);
    if(dst == null){
      return null;
    }
    else{
      return jsyaml.load(dst);
    }
  }
  

     
}
