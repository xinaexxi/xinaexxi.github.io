let login ;
let todo ;
let init ;
const body = document.querySelector('body');
const bodyBg = ['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg','bg6.jpg','bg7.jpg','bg8.jpg','bg9.jpg','bg10.jpg']

// user
const userBtn = document.querySelector('header .leftbar .user');
// login
const loginBox = document.querySelector('#loginBox');
const loginBg = document.querySelector('#loginBg');
const loginInput = document.querySelector('#loginForm input')
const loginBtn = document.querySelector('#loginForm button')
// todolist
const addInput = document.querySelector('section .addInput input')
const addBtn = document.querySelector('section .addInput .addBtn')
const addList = document.querySelector('section .addList')
const trashBinBtn = document.querySelector('section .listTitle .deleteBtn')
const todoSizeBtn = document.querySelector('#todoList .leftSide')
//d-day
const dDaySizeBtn = document.querySelector('#dDay .leftSide');
const dDayTitle = document.querySelector('#dDay #dDayForm .titleInput');
const dDayDate = document.querySelector('#dDay #dDayForm .dayInput');
const dDayBtn = document.querySelector('#dDay #dDayForm .dDayBtn');

let todoArr = []; //
let dDayArr = []; //
let userName ; //
let nowHour ; //인사말 설정할 현재 시간
let nowDate ; //오늘 날짜

//로컬에 저장된 정보 있을시 불러오기
const storageTodoItems = JSON.parse(localStorage.getItem("todoItems"));
const storageUserNm = JSON.parse(localStorage.getItem("userName"));
const storageDDayItems = JSON.parse(localStorage.getItem("dayItems"));

//랜덤배경 설정
let randomImg = bodyBg[Math.floor(Math.random() * bodyBg.length)];
body.style.backgroundImage = "url(./img/"+ randomImg +")"

//시계 설정
init = {
    start : function(){

        // 스토리지에 유저네임이 있으면 로그인 hidden
        if ( storageUserNm ) {
            loginBox.classList.add('hidden');
            loginBg.classList.add('hidden');
            userName = storageUserNm ;
        }
        init.setTime(); //시간 설정
        init.setUser(); //유저이름 설정
        todo.setTodoList(); //투두리스트 설정
        DDay.setDDay(); //디데이 설정

    },
    setTime : function(){
        const timeDiv = document.querySelector('header .time')

        let time = new Date() ;
        let month = String(time.getMonth() + 1 ).padStart(2,'0');
        let date = String(time.getDate() ).padStart(2,'0'); //일
        let day = time.getDay(); //요일
        let hour = String(time.getHours() ).padStart(2,'0');
        let minute = String(time.getMinutes() ).padStart(2,'0');
        let WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
        nowDate = time ;
        nowHour = hour ;
        timeDiv.innerText = `${month}월 ${date}일 (${WEEKDAY[day]}) ${hour}:${minute} `

    },
    setUser : function(){
        const userDt = document.querySelector('header .user')
        if(userName == undefined){
            userDt.innerText = `DESKTOP`
        } else {
            userDt.innerText = `${userName}'s DESKTOP`
        }
    }

}

login = {
    //로그인 버튼 클릭
    loginBtnClickHandler : function (e) {
        e.preventDefault(); 

        let loginValue = loginInput.value ;

        if( loginValue ){
            localStorage.setItem("userName", JSON.stringify(loginValue))
            userName = JSON.parse(JSON.stringify(loginValue)) ;
            loginInput.value = '' ;

            loginBox.classList.add("hidden");
            loginBg.classList.add("hidden");
            // todo.setTodoList();
            init.setUser();
            todo.setTodoList();
        } 
    }

}

todo = {
    setTodoList : function (){

        let greeting = document.querySelector('h2.greeting')
        let greetingMent ;

        if( nowHour < 12 ){
            greetingMent = 'Good morning'
        } else if( 12 <= nowHour  && nowHour <= 17){
            greetingMent = 'Good afternoon'
        } else if ( 17 < nowHour && nowHour < 24){
            greetingMent = 'Good evening'
        }
        greeting.innerText = `${greetingMent} ${userName} :-)`

        //스토리지에 투두데이터가 있으면 표출
        if ( storageTodoItems ) {
            storageTodoItems.forEach((e) => {
        
            //화면에 추가
            todo.addListHandler(e.text);
        });
    //
    }
    },
    //list에 넣어주는 function
    addListHandler : function(value){ 
        let li = document.createElement('li');
        let span = document.createElement('span');
        let btn = document.createElement('button');
        //로컬에 저장
        let todoItem = {
            id : todoArr.length + 1 ,
            text : value
        }
        todoArr.push(todoItem);
        localStorage.setItem('todoItems', JSON.stringify(todoArr));

        li.setAttribute('onClick','todo.checkTaskHandler(this)') ; //list 클릭이벤트 속성에 넣어주기
        li.setAttribute('id',`${todoArr.length + 1}`) ; //list 클릭이벤트 속성에 넣어주기
        li.innerText = value ;
        
        btn.setAttribute('onClick', 'todo.deleteListHandler(this)' )
        btn.innerText = 'X';
        
        li.appendChild(btn);
        li.appendChild(span);
        addList.prepend(li);
    },
    //할일 등록
    addBtnClickHandler : function(e){
        e.preventDefault(); //폼태그 원래 기능 초기화 (화면 새로고침)

        let inputValue = addInput.value;

        if( inputValue !== ''){
            todo.addListHandler(inputValue);
            addInput.value = '' ; //input 값 비워주기
        }
    },
    //다 한 일 체크
    checkTaskHandler : function(click){ 
        if( !click.classList.contains('check') ){ //체크 안되어있으면
            click.classList.add('check')
        } else {
            click.classList.remove('check')
        }
    },
    //휴지통 버튼 클릭
    trashBinBtnClickHandler : function (click){
        let deleteBtn =  document.querySelectorAll('.addList button')

        for(let i = 0 ; i < deleteBtn.length; i++){
            if( deleteBtn[i].classList.contains('show') ){
                deleteBtn[i].classList.remove('show');
            } else {
                deleteBtn[i].classList.add('show');
            }
        }
    },
    //리스트에서 삭제
    deleteListHandler : function (click){ 

        let li = click.parentNode;
        let id = li.getAttribute('id');
        //화면에서 삭제
        li.remove(); 
        //로컬에서 삭제
        for(let i = 0 ; i < todoArr.length; i++){
            if( todoArr[i].id == id-1 ){
                todoArr.splice( i , 1 );
            }
        }
        localStorage.setItem('todoItems', JSON.stringify(todoArr))
    },
    //사이즈 변경하기
    sizeChangeHandler : function(){
        let todoList = document.querySelector('#todoList');
        if( todoList.classList.contains('big') ){
            todoList.classList.remove('big') ;
        } else {
            todoList.classList.add('big') ;
        }

    }
}
//디데이

DDay = {
    setDDay : function(){
        let dDayList = document.querySelector('#dDay .dDayCont .dList');
        //add your d-day 작성
        let p = document.createElement('p');
        p.innerText = 'add your d-day !'
        dDayList.appendChild(p);

        //스토리지에 디데이가 있으면 표출
        if( storageDDayItems ){
            storageDDayItems.forEach((item)=>{
                DDay.addDDay(item.title , item.day);
            })
        }


    },
    //사이즈 변경하기
    sizeChangeHandler : function(){
        let dDayDiv = document.querySelector('#dDay');
        if( dDayDiv.classList.contains('big') ){
            dDayDiv.classList.remove('big') ;
        } else {
            dDayDiv.classList.add('big') ;
        }
    },
    calculate : function(e){
        e.preventDefault();
        let title = dDayTitle.value ;
        let date = dDayDate.value ;
        if( title == '' ){
            alert('디데이 이름을 입력해주세요') ;
        } else if( date == ''){
            alert('날짜를 선택해주세요') ;
        } else {
            let enterDate = new Date(date) ; 
            let gapDay = enterDate.getTime() - nowDate.getTime() ;

            gapDay =  Math.floor(gapDay / (1000 *60 * 60 * 24)) + 1 ;

            DDay.addDDay(title , gapDay);

            dDayTitle.value = '';
            dDayDate.value = '';
        }
    },
    addDDay : function(title , dday){
        let dDayList = document.querySelector('#dDay .dDayCont .dList');
        let div = document.createElement('div');
        let h5 = document.createElement('ul');
        let span = document.createElement('li');
        let button = document.createElement('button');
        //화면세팅
        button.setAttribute('class', 'deleteBtn');
        button.setAttribute('onClick', 'DDay.deleteDDay(this)');
        button.innerText = 'x' ;

        h5.setAttribute('class', 'dTitle');
        h5.innerText = title ;

        span.setAttribute('class', 'dNum');
        span.innerText = `D - ${dday}` ;

        div.appendChild(button);
        div.appendChild(h5);
        div.appendChild(span);
        
        dDayList.append(div);

        //로컬에 저장
        let dayItem = {
            title : title ,
            day : dday
        }
        
        dDayArr.push(dayItem);
        localStorage.setItem('dayItems',JSON.stringify(dDayArr));

        if( dDayArr.length == 1 ){
            let p = document.querySelector('#dDay .dDayCont .dList p');
            p.remove();
        }

    },
    deleteDDay : function(click){
        let div = click.parentNode;
         //화면에서 삭제
        div.remove();
        //로컬에서 삭제
        for( let i = 0; i < dDayArr.length; i++ ){
            let data = `x${dDayArr[i].title}D - ${dDayArr[i].day}`

            if( click.parentNode.innerText == data ){
                dDayArr.splice( i , 1 );
            }
        }
        localStorage.setItem('dayItems',JSON.stringify(dDayArr));

        //디데이가 다 지워지면 'add your d-day' 추가
        if( dDayArr.length == 0 ){
            let dDayList = document.querySelector('#dDay .dDayCont .dList');

            let p = document.createElement('p');
            p.innerText = 'add your d-day !'
            dDayList.appendChild(p)
        }
    },
}

//로그아웃 이벤트
function logoutHandler(){
    if(confirm('로그아웃시 데이터가 모두 사라집니다. 로그아웃 하시겠습니까?')){
        todoArr = [] ;
        dDayArr = [] ;

        localStorage.clear()

        loginBox.classList.remove("hidden");
        loginBg.classList.remove("hidden");

        location.reload()
    }
}

//날씨
const city = document.querySelector('#weather .weatherCont .city');
const tmp = document.querySelector('#weather .weatherCont .tmp');
const maxTmp = document.querySelector('#weather .weatherCont .maxTmp');
const minTmp = document.querySelector('#weather .weatherCont .minTmp');

function geoSuccess(position){
    let lat = position.coords.latitude ;
    let lon = position.coords.longitude ;
    const APIkey = '6cba561051ed2cd0fc752f2e74f00bf9' ;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=ko-KR`
    fetch(url)
    .then(response => response.json())
    .then(data=>{
        console.log( data , data.weather[0].main )
        const name = data.name ;
        const weather =  data.weather[0].main ;
        const temp =  Math.floor(data.main.temp) ;
        const tempMax =  Math.floor(data.main.temp_max);
        const tempMin =  Math.floor(data.main.temp_min);

        city.innerText = `${name}의 날씨`
        tmp.innerText = `${temp}°C` ;
        maxTmp.innerText = `최고:${tempMax}°C` ;
        minTmp.innerText = `최저:${tempMin}°C` ;
    });
}
function geoFail(){
    alert('fail')
}





userBtn.addEventListener('click', logoutHandler);
addBtn.addEventListener('click', todo.addBtnClickHandler);
trashBinBtn.addEventListener('click', todo.trashBinBtnClickHandler);
todoSizeBtn.addEventListener('click', todo.sizeChangeHandler);
dDaySizeBtn.addEventListener('click', DDay.sizeChangeHandler);
dDayBtn.addEventListener('click', DDay.calculate);
loginBtn.addEventListener('click', login.loginBtnClickHandler);

navigator.geolocation.getCurrentPosition( geoSuccess , geoFail );
setInterval(init.setTime(),1000)

init.start();
