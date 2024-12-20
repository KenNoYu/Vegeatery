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
You only need to clone the repository **once**. When you clone it, a copy of vegeatery will be inside your computer already.

<br>
<br>

## Installing dependcies
Inside Visual Studio Code in Terminal
```
npm i
```
If the terminal prompts errors after npm i, run. 
```
npm audit fix
```
Im not sure how these node modules work so the only fix I know is npm audit fix

<br>
<br>

## Running the application
In order to run the web application, both server and client has to be running
### Running the Server
- Open the vegeatery.sln in server folder using Visual Studio 2022
- Configure Database **[<kbd> <br> Configure DB <br> </kbd>](#Configuring-Database)**
- Run the application
### Running the Client
- Open the whole project in Visual Studio Code
Inside Terminal
```
npm i
npm start
```

<br>
<br>

## Configuring Database
In order to setup the database for your own use inside VS 2022
- Open up Nuget Manager Console under Tools at the top bar
```
Add-Migration <Migration-Name>
Update-Database
```
> **WARNING**: You **MUST** have versions 8.0.0 and above installed for the SQL packages in your Nuget Package Manager and **NOT** version 9.0.0 otherwise you will be unable to create the Migration.

<br>
<br>

## Connecting Server to Client
Server and Client are connected by default through the http port number. Port for server can be found in the _vegeatery.http_ file and to connect the port from client to server.
In file _client\.env.development_, you only need to change the port number.

<br>
<br>

# Project Contribution
_This is an example of where you can write your code.
To start on your part, follow these simple steps._

## Branch
When doing your part always create a new branch. In terminal
```
git checkout -b <branchname>
```

## Contributing
When you want to push changes to main remember to first commit to your remote branch. Then create a pull request to merge with main branch

<br>
<br>

## Where to contibute to your part
_This shows where you can contribute to your part in the project file._
### Server (Open in VS 2022)
- In the folder _Models_, this is where you can add your classes for your database tables
- In the file _MyDBContext.cs_, you can create your new database table inside here
- In the folder _Controller_, this is where you can add your various request such as post, get and delete for your API endpoints
- In the file _Program.cs_, this is where you can configure information regarding the server such as authentication, cookies etc..
### Client (Open in VS Code)
- In the folder _Public_, this is where your images will be at, if possible use only SVG or WEBP file formats
- In the folder _src\pages_, this is where you can create your html pages using React, and sending request to your API endpoints
- In the folder _src\context_, this is where you can add your context state, such as creating new users or new item

<br>
<br>

## Testing your endpoints
- To test your own endpoints inside VS 2022 in _vegeatery.http_, generate your request from endpoints explorer and test it yourself. I have 2 examples inside for reference.
- **Do Not Commit the Vegeatery.http file, its for your own testing purpose**

<br>
<br>

## Sending Request from the client
In order to send a request from client, you must first have a API endpoints created. These endpoints can be made inside _Controller_ folder in server.
An example would be.
```
// Create new product
[HttpPost]
public IActionResult AddProduct(Product product)
{
    var now = DateTime.Now;
    var newProduct = new Product()
    {
        productName = product.productName.Trim(),
        productDescription = product.productDescription.Trim(),
        productCategory = product.productCategory.Trim(),
        CreatedAt = now,
        UpdatedAt = now

    };

    _context.Product.Add(newProduct);
    _context.SaveChanges();
    return Ok(newProduct);
}
```
Now that we have an API controller. We need to generate these from _Endpoints Explorer_ to see what the route looks like
An example in _vegeatery.http_ would be.
```
POST {{vegeatery_HostAddress}}/product
Content-Type: application/json

{
  "productName":"Rice",
  "productDescription":"Rice",
  "productCategory":"Carbo"
}
```
> **Reminder**: You do not need to commit the _vegeatery.http_ file, its for testing purposes only.

So we have an API for creating a new product, now we need to create the client page to enable it to send request to the server. 
I will be using the AddTutorial as an example as I have not created one for products but the logic is still the same.
```
function AddTutorial() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: ""
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.post("/tutorial", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/tutorials");
                });
        }
    });
}
```
The important line here is the _http.post("/tutorial", data)_. this is what will send the request to the server from the client. So the format is like this
```
http.<request>("<route>", <data>)
```
Another example for getting tutorials from server. 
```
const getTutorials = () => {
        http.get('/tutorial').then((res) => {
            setTutorialList(res.data);
        });
    };
```

## Frontend Design
Now for the how the website will look like, I will use the Tutorials page as an example.
```
function Tutorials() {
<Tutorial Functions> ...
return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Tutorials
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/addtutorial">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    tutorialList.map((tutorial, i) => {
                        return (
                            <Grid size={{xs:12, md:6, lg:4}} key={tutorial.id}>
                                <Card>
                                    {
                                        tutorial.imageFile && (
                                            <Box className="aspect-ratio-container">
                                                <img alt="tutorial"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${tutorial.imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {tutorial.title}
                                            </Typography>
                                            {
                                                user && user.id === tutorial.userId && (
                                                    <Link to={`/edittutorial/${tutorial.id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                )
                                            }
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>
                                                {tutorial.user?.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(tutorial.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {tutorial.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}
export default Tutorials;
```
The part where your html will be is placed inside _return()_. Tutorial Functions means the functions used by the page for sending request and receiving response from the server.

<br>
Thanks for reading the README and hopefully you are able to understand most of what needs to be done through README.md If you still have any questions feel free to ask me :)
<br>

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
