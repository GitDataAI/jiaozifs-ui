
# JiaoZiFS(JZFS)-UI
A UI of JiaoZiFS(A version control file system for data centric applications & teams).

<p align="left">
  <a href="https://www.npmjs.com/package/npm">
       <img src="https://camo.githubusercontent.com/ae8e4bb0c53259a19bfe3a79d29797a2d7b38cf50251ac18a60c9e91846c5aa0/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f6e706d2e737667" alt="npm package" />
    </a>
    <a href="http://www.typescriptlang.org/"><img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=flat-square" height="20"></a>
  <br/>
</p>

<a href="https://github.com/GitDataAI/jiaozifs"><img src="https://github.com/GitDataAI/jiaozifs/blob/main/docs/logo/jiaozifs.png?raw=true" width="100" /></a>

----
### What is JiaoZiFS?
JiaoZiFS is an industry-leading **Data-Centric Version Control** File System, helps ensure Responsible AI Engineering by improving **Data Versioning**, **Provenance**, and **Reproducibility**.

Note:
* The name JiaoZi pays tribute to the world's earliest paper money: [Song Dynasty JiaoZi](https://en.wikipedia.org/wiki/Jiaozi_(currency)).
* JiaoZiFS is yet another implementation of [IPFS (InterPlanetary File System)](https://ipfs.tech/) as JiaoZiFS will be compatible with the [implementation requirements](https://specs.ipfs.tech/architecture/principles/#ipfs-implementation-requirements) of IPFS.
* As a filesystem of data versioning at scale, although JiaoZiFS is built for machine learning, It has a wide range of use scenarios (refer A Universe of Uses) and can be seamlessly integrated into all your data stack.

Data-centric AI is about the practice of iterating and collaborating on data, used to build AI systems, programmatically. Machine learning pioneer Andrew Ng [argues that focusing on the quality of data fueling AI systems will help unlock its full power](https://youtu.be/TU6u_T-s68Y).

----
### Why JiaoZiFS?
In production systems with machine learning components, updates and experiments are frequent. New updates to models(data products) may be released every day or every few minutes, and different users may see the results of different models as part of A/B experiments or canary releases.

* **Version Everything**: Data scientists are often criticized for being less disciplined with versioning their experiments(versioning of data, pipeline, code, and models), especially when using computational notebooks.
* **Track Data Provenance**: This applies to all processing steps in an AI/ML pipeline, including data collection/acquisition, data merging, data cleaning, feature extraction, learning, or deployment.
* **Reproducibility**: A final question of AI/ML that is often relevant for debugging, audits, and also science more broadly is to what degree data, models, and decisions can be reproduced.

----
### A Universe of Uses
JiaoZiFS's versatility shines across different industries – making it the multi-purpose tool for the **data centric applications and teams**.

* **Enterprise DataHub & Data Collaboration**: Depending on your operating scale, you may even be managing multiple team members, who may be spread across different locations. JiaoZiFS enable Collaborative Datasets Version Management at Scale,Share & collaborate easily: Instantly share insights and co-edit with your team.
* **DataOps & Data Products & Data Mesh**: Augmenting Enterprise Data Development and Operations,JiaoZiFS ensures Responsible DataOps/AIOps/MLOps by improving Data Versioning, Provenance, and Reproducibility. JiaoziFS makes a fusion of data science and product development and allows data to be containerized into shareable, tradeable, and trackable assets(data products or data NFTs). Versioning data products in a maturing Data Mesh environment via standard processes, data consumers can be informed about both breaking and non-breaking changes in a data product, as well as retirement of data products.
* **Industrial Digital Twin**: Developing digital twins for manufacturing involves managing tons of large files and multiple iterations of a project. All of the data collected and created in the digital twin process (and there is a lot of it) needs to be managed carefully. JiaoziFS allows you to manage changes to files over time and store these modifications in a database.
* **Data Lake Management**: Data lakes are dynamic.   New files and new versions of ex- isting files enter the lake at the ingestion stage.   Additionally, extractors can evolve over time and generate new versions of raw data.   As a result, data lake versioning is a cross-cutting concern across all stages of a data lake.   Of course vanilla dis- tributed file systems are not adequate for versioning-related operations.   For example, simply storing all versions may be too costly for large datasets, and without a good version manager, just using filenames to track versions can be error-prone.   In a data lake, for which there are usually many users, it is even more important to clearly maintain correct versions being used and evolving across different users.   Furthermore, as the number of versions increases, efficiently and cost-effectively providing storage and retrieval of versions is going to be an important feature of a successful data lake system.
----
### Specification

[JiaoZiFS Specification](https://github.com/GitDataAI/Specification/blob/main/JiaoziFS)

----
### Basic Build And Usage

#### Requirement

1. todo
2. todo

#### Build And Running

deploy the system to your server,you can get help from this repository:
```bash
https://github.com/GitDataAI/jiaozifs
```

clone jiaozifs-ui repository to your server:

```bash
git clone git@github.com:GitDataAI/jiaozifs-ui.git
```

Before you run the project for the first time, run the following script to install packages from `package.json`:
```bash
npm install
```
After waiting for the installation to complete,run the following script to start:
```bash
npm run dev
```
You can also deploy the code to your server by using `docker`:

```bash
docker run -it -p 12345:80 -e JIAOZIFS_API_URL=http://api.jiaozifs.com/api/v1 gitdatateam/jiaozifs-ui:latest
```


----
### Cloud

[Try without installing](https://cloud.jiaozifs.com)

----
### Contributors

<a href="https://github.com/TsumikiQAQ" target="_blank"><img src="https://avatars.githubusercontent.com/u/116857998?v=4" width="5%" height="5%"/> </a>
<a href="https://github.com/hunjixin" target="_blank"><img src="https://avatars.githubusercontent.com/u/41407352?v=4" width="5%" height="5%"/> </a>
<a href="https://github.com/Brownjy" target="_blank"><img src="https://avatars.githubusercontent.com/u/54040689?v=4" width="5%" height="5%"/> </a>
<a href="https://github.com/taoshengshi" target="_blank"><img src="https://avatars.githubusercontent.com/u/33315004?v=4" width="5%" height="5%"/> </a>
<a href="https://github.com/gitdata001" target="_blank"><img src="https://avatars.githubusercontent.com/u/157772574?v=4" width="5%" height="5%"/> </a>

----
### License

Dual-licensed under [MIT](https://github.com/GitDataAI/jiaozifs/blob/main/LICENSE-MIT) + [Apache 2.0](https://github.com/GitDataAI/jiaozifs/blob/main/LICENSE-APACHE)

