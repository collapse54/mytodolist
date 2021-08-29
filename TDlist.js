let section = document.querySelector("section");
let add = document.querySelector("form button");

add.addEventListener("click", e =>{
    e.preventDefault();

    //get the value from the form
    let form=e.target.parentElement;
    let todotext=form.children[0].value;
    let todomonth=form.children[1].value;
    let tododate=form.children[2].value;

    if(todotext === ""){
        //alert("Don't waste your time!");
        //return;
    }

    //create a to do
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text= document.createElement("p");
    text.classList.add("todo-text");
    text.innerText=todotext;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText= todomonth+" / "+tododate;
    todo.appendChild(text);
    todo.appendChild(time);

    //complete and delete button
    let completebutton = document.createElement("button");
    completebutton.classList.add("complete");
    completebutton.innerHTML='<i class="fas fa-check"></i>';
    let completeclick = completebutton.addEventListener("click",e=>{
        let todoitem = e.target.parentElement;
        todoitem.classList.toggle("done");
    })

    let trashcanbutton = document.createElement("button");
    trashcanbutton.classList.add("trashcan");
    trashcanbutton.innerHTML='<i class="fas fa-trash"></i>';
    let trashcanclick = trashcanbutton.addEventListener("click",e=>{
        let todoitem = e.target.parentElement;
        todoitem.addEventListener("animationend",()=>{
            //remove for local storage
            let text = todoitem.children[0].innerText;
            let mylistArray = JSON.parse(localStorage.getItem("list"));
            mylistArray.forEach((item,index) =>{
                if(item.todotext == text){
                    mylistArray.splice(index,1)
                    localStorage.setItem("list", JSON.stringify(mylistArray)); 
                }
            })
            todoitem.remove();
        })
        todo.style.animation="scaleDown 0.3s forwards"; 
    })

    todo.appendChild(completebutton);
    todo.appendChild(trashcanbutton);

    todo.style.animation="scaleUp 0.3s forwards";

    //create my todo object
    let mytodo={
        todotext: todotext,
        todomonth: todomonth,
        tododate: tododate
    };

    //add into list for storage
    let mylist = localStorage.getItem("list");
    if(mylist==null){
        localStorage.setItem("list",JSON.stringify([mytodo]));
    }
    else{
        let mylistArray= JSON.parse(mylist);
        mylistArray.push(mytodo);
        localStorage.setItem("list",JSON.stringify(mylistArray));
    }
    console.log(JSON.parse(localStorage.getItem("list")));

    section.appendChild(todo);

    //reset text input
    form.children[0].value="";
}
)

loadData();

function loadData(){
    let mylist = localStorage.getItem("list");
    if(mylist != null){
        let mylistArray=JSON.parse(mylist);
        mylistArray.forEach(e => {

            //create a to do
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText=e.todotext;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = e.todomonth +" / "+ e.tododate;
            todo.appendChild(text);
            todo.appendChild(time);

            //complete and delete button
            let completebutton = document.createElement("button");
            completebutton.classList.add("complete");
            completebutton.innerHTML='<i class="fas fa-check"></i>';
            let completeclick = completebutton.addEventListener("click",e=>{
                let todoitem = e.target.parentElement;
                todoitem.classList.toggle("done");
            })

            let trashcanbutton = document.createElement("button");
            trashcanbutton.classList.add("trashcan");
            trashcanbutton.innerHTML='<i class="fas fa-trash"></i>';
            let trashcanclick = trashcanbutton.addEventListener("click",e=>{
            let todoitem = e.target.parentElement;
                todoitem.addEventListener("animationend",()=>{

                    //remove for local storage
                    let text = todoitem.children[0].innerText;
                    let mylistArray = JSON.parse(localStorage.getItem("list"));
                    mylistArray.forEach((item,index) =>{
                        if(item.todotext==text){
                            mylistArray.splice(index,1)
                            localStorage.setItem("list", JSON.stringify(mylistArray)); 
                        }
                    })
                    todoitem.remove();
                })
                todo.style.animation="scaleDown 0.3s forwards"; 
            })

            todo.appendChild(completebutton);
            todo.appendChild(trashcanbutton);

            todo.style.animation="scaleUp 0.3s forwards";

            section.appendChild(todo);

        });
    }
}

//排序
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while ( i < arr1.length && j < arr2.length ) {
        if (Number(arr1[i].todomonth) > Number(arr2[j].todomonth) ) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todomonth) < Number(arr2[j].todomonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todomonth) == Number(arr2[j].todomonth)) {
            if (Number(arr1[i].tododate) > Number(arr2[j].tododate )) {
                result.push(arr2[j]);
                j++;
            } else{
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while(i<arr1.length){
        result.push(arr1[i]);
        i++;
    }
    while(j<arr2.length){
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergesort(arr){
    if (arr.length === 1){
        return arr;
    }else{
        let mid = Math.floor(arr.length / 2);
        let left = arr.slice(0, mid);
        let right = arr.slice(mid, arr.length);
        return mergeTime(mergesort(left), mergesort(right));
    }
}

console.log(mergesort(JSON.parse(localStorage.getItem("list"))));

let sort = document.querySelector("div.sort button");

let sortbutton = sort.addEventListener("click", e =>{
    //sort data

    let sortedArray = mergesort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    //clear section
    let len = section.children.length
    for(i=0; i<len; i++){
        section.children[0].remove();
    }

    //reload sorted data
    loadData();
})