###### _<div align="right"><sub>// made with &lt;3</sub></div>_

<div align="center">



<a href="https://github.com/KenNoYu/Vegeatery">
  <img src="https://github.com/KenNoYu/Vegeatery/blob/main/assets/logo.svg" width="750" height="300" alt="">
</a>

<br>



![badge-workflow]
[![badge-license]][license]
![badge-language]
[![badge-pr]][prs]
[![badge-issues]][issues]

<br><br>



Vegeatery is an eatery that promotes different kinds of vegetarian diet using ingredients sourced locally from sustainable farms, and eco-friendly producers. We aim to promote a healthy earth and lifestyle while meeting the needs of our customers.

<br><br>

---



**[<kbd> <br> Quick Start <br> </kbd>](#quick-start)**

**[<kbd> <br> Thanks <br> </kbd>](#special-thanks)**
**[<kbd> <br> Contribute <br> </kbd>][contribute]**

---

<br>

</div>

# Project Guide

_This is an example of how you can set up your project locally.
To get a local copy up and running, follow these simple steps._

## Installation

Clone the repository
```sh
git clone https://github.com/KenNoYu/Vegeatery
cd Vegeatery
code .
```

## Installing dependcies
Inside Visual Studio Code in Terminal
```
npm i
```

## running the application
In order to run the web application, both server and client has to be running
### Running the Server
- Open the vegeatery.sln in server folder using Visual Studio 2022 and run the application
### Running the Client
- Open the whole project in Visual Studio Code
Inside Terminal
```
npm i
npm start
```

## Configuring Database
In order to setup the database for your own use inside VS 2022
- Open up Nuget Manager Console under Tools at the top bar
```
Add-Migration <Migration-Name>
Update-Database
```
> **WARNING**: You **MUST** have versions 8.0.0 and above installed for the SQL packages in your Nuget Package Manager and **NOT** version 9.0.0 otherwise you will be unable to create the Migration.

## Where to contibute to your part
_This shows where you can contribute to your part in the project file._
### Server
- In the folder _Models_, this is where you can add your classes for your database tables
- In the file _DBContext_, you can create your new database table inside here
- In the folder _Controller_, this is where you can add your various request such as post, get and delete for your API endpoints
### Client
- In the folder _Public_, this is where your images will be at, if possible use only SVG or WEBP file formats
- In the folder _src\pages_, this is where you can create your html pages using React, and sending request to your API endpoints
- In the folder _src\context_, this is where you can add your context state, such as creating new users or new item

<div align="right">
  <br>
  <a href="#-made-with-3"><kbd> <br> 🡅 <br> </kbd></a>
</div>

## Special Thanks

- **[Caffeine-addictt][template-repo]** - _For the repository template_
- **[Img Shields][img-shields]** - _For the awesome README badges_
- **[Hyprland][hyprland]** - _For showing how to make beautiful READMEs_
- **[Hyprdots][hyprdots]** - _For showing how to make beautiful READMEs_

---

![stars-graph]




[stars-graph]: https://starchart.cc/KenNoYu/Vegeatery.svg?variant=adaptive
[prs]: https://github.com/KenNoYu/Vegeatery/pulls
[issues]: https://github.com/KenNoYu/Vegeatery/issues
[license]: https://github.com/KenNoYu/Vegeatery/blob/main/LICENSE



[contribute]: https://github.com/KenNoYu/Vegeatery/blob/main/CONTRIBUTING.md



[template-repo]: https://github.com/caffeine-addictt/waku
[hyprland]: https://github.com/hyprwm/Hyprland
[hyprdots]: https://github.com/prasanthrangan/hyprdots
[img-shields]: https://shields.io



[badge-workflow]: https://github.com/KenNoYu/Vegeatery/actions/workflows/test-worker.yml/badge.svg
[badge-issues]: https://img.shields.io/github/issues/KenNoYu/Vegeatery
[badge-pr]: https://img.shields.io/github/issues-pr/KenNoYu/Vegeatery
[badge-language]: https://img.shields.io/github/languages/top/KenNoYu/Vegeatery
[badge-license]: https://img.shields.io/github/license/KenNoYu/Vegeatery
