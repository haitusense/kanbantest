// <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.14.0/js-yaml.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"></script>
// <script src="https://bundle.run/buffer"></script>

class GithubAPI {

  static regExp = /```([^)]+)```/gm;

  // constructor
  constructor(accessToken) {
    this.accessToken = accessToken;
    if(accessToken == undefined){
      this.octokit = new Octokit();
      this.graphqlWithAuth = graphql.defaults();
    }else{
      this.octokit = new Octokit({
        auth: accessToken
      });
      this.graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `token ${accessToken}`,
        }
      });
    }
  }

  // changeAuth
  changeAuth(accessToken) {
    this.accessToken = accessToken;
    if(accessToken == undefined){
      this.octokit = new Octokit();
      this.graphqlWithAuth = graphql.defaults();
    }else{
      this.octokit = new Octokit({
        auth: accessToken
      });
      //this.octokit.authenticate({
      //  type: 'token',
      //  token: accessToken,
      //});
      this.graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `token ${accessToken}`,
        }
      });
    }
  }

  async asyncGetRateLimit() {
    if(this.accessToken == undefined){
      return this.octokit.rateLimit.get().then(dst => {
        return {
          login : undefined,
          ...dst.data.rate
        };
      });
    }else{
      return this.graphqlWithAuth(`{
        viewer {
          login
        }
        rateLimit {
          limit
          cost
          remaining
          resetAt
        }
      }`).then(dst => {
        return {
          ...dst.viewer,         
          ...dst.rateLimit
        };
      });
    }
  }

  // Get Issue
  async asyncGetIssuesFromTitle(owner, repo, title, num) {
    if(this.accessToken == undefined){
      return this.octokit.search.issuesAndPullRequests({
        q : `${title} in:title repo:${owner}/${repo} type:issue`,
      }).then(dst => {
        return { 
          data : dst.data.items,
          count : dst.data.total_count
        }
      });
    }else{
      return this.graphqlWithAuth(`{
        search(query: "${title} in:title repo:${owner}/${repo}", type: ISSUE, first: ${num}) {
          edges {
            node {
              ... on Issue {
                id
                number
                body
                title
                url
                projectCards {
                  nodes {
                    column {
                      name
                    }
                  }
                }
              }       
            }
          }
          issueCount
        }
      }`).then(dst => {
        return { 
          data : dst.search.edges.map(n=>({
            ...(n.node), 
            html_url : n.node.url
          })),
          count : dst.search.issueCount
        }
      });
    }
  }

  async asyncGetIssueFromNum(owner, repo, num) {
    if(this.accessToken == undefined){
      let issue = await this.octokit.issues.get({
        owner : owner,
        repo : repo,
        issue_number : num,
      });
      let comments = await this.octokit.issues.listComments({
        owner : owner,
        repo : repo,
        issue_number  : num,
      });
      console.log(issue);
      return {
        ...(issue.data),
        kanban : undefined,
        comments : {
          count : issue.data.comments,
          data : comments
        }
      };
    }else{
      return this.graphqlWithAuth(`{
        repository(owner: "${owner}", name: "${repo}") {
          issue(number: ${num}) {
            url
            body
            title
            comments(first: 100) {
              nodes {
                body
              }
            }
            projectCards {
              nodes {
                column {
                  name
                }
              }
            }
          }
        }
      }`).then(dst => {
        const src = dst.repository.issue;
        return {
          ...(src),
          html_url : src.url,
          kanban : src.projectCards.nodes.length == 1 ? src.projectCards.nodes[0].column.name : undefined,
          comments : {
            count : src.comments.nodes.length,
            data : src.comments.nodes
          }
        };
      });
    }
  }

/** */

  async asyncGetIssueFromNodeId(node_id) {
    if(this.accessToken == undefined){
      return undefined;
    }else{
      return this.graphqlWithAuth(`{
        node(id: ${node_id}) {
          id
          ... on Issue {
            id
            number
            title
            body
            comments(first: 10) {
              nodes {
                body
              }
            }
          }
        }
      }`).then(dst => {
        return {
          issue : dst.data,
          comments : dst.data.comments.nodes
        };
      });
    }
  }

  MarkdownToYaml(src){
    let matches = this.regExp.exec(src);
    if(matches == undefined){ 
      return undefined;
    }else{
      return jsyaml.load(matches[1]);
    }
  }

  IssueToYaml(issue){
    var dst = MarkdownToYaml(issue.body);
    if(dst == undefined){
      return undefined;
    }else{
      issue.comments.data.forEach(element => {
        let yaml = MarkdownToYaml(element.body);
        if(yaml != undefined) _.merge(dst, yaml);
      });
      return dst;
    }
  }

  //************* */

  
  async asyncMergeIssueYaml(owner, repo, issue){
    var dst = MarkdownToYaml(issue.body);
    if(dst == null){
      return null;
    }else{
      await this.octokit.issues.listComments({
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
  
  async asyncGetIssueEx(owner, repo, title){
    let query = `{
      search(query: "${title} in:title user:${owner} repo:${repo}", type: ISSUE, first: 10) {
        edges {
          node {
            ... on Issue {
              id
              body
              title
              projectCards {
                nodes {
                  column {
                    name
                  }
                }
              }
            }
          }
        }
        issueCount
      }
    }`;
    try {
      return graphqlWithAuth(query);
    } catch (error) {
      console.log("Request failed:", error.request);
      console.log(error.message);
    }
  }

}