window.onload = async function loadProfile() {
    const user = localStorage.getItem("payload")
    const user_id = user.split(':')[5].slice(0, -1);
    console.log("user_id pk : " + user_id)

    const urlParams = new URL(location.href).searchParams;
    const profile_id = urlParams.get('id');
    console.log("profile_id : " + profile_id)

    const response = await fetch('http://127.0.0.1:8000/users/profile/'+profile_id+'/', {
        method:"GET"
    })
    response_json = await response.json()
    console.log(response_json)

    // 유저 프로필 보기
    const profile_image = document.getElementById("profile_image")
    profile_image.setAttribute("src", response_json["가입정보"]["profile_image_url"])

    const email = document.getElementById("email")
    email.innerText = response_json["가입정보"]["email"]
        
    // 유저 작성 게시글 보기
    const user_articles = document.getElementById("user_articles")
    response_json["게시글"].forEach(art => {
        const user_article = document.createElement("li")
        user_article.setAttribute("class", "article-container")
        const user_article_title = document.createElement("p")
        user_article_title.innerText = art['title']
        const user_article_content = document.createElement("p")
        user_article_content.innerText = art['content']
        user_article.appendChild(user_article_title)
        user_article.appendChild(user_article_content)
        user_articles.appendChild(user_article)
    })

    // 좋아요 게시글 보기
    const user_like_articles = document.getElementById("user_like_articles")
    response_json["좋아요 게시글"].forEach(art => {
        const user_article = document.createElement("li")
        user_article.setAttribute("class", "article-container")
        const user_article_title = document.createElement("p")
        user_article_title.innerText = art['title']
        const user_article_content = document.createElement("p")
        user_article_content.innerText = art['content']
        user_article.appendChild(user_article_title)
        user_article.appendChild(user_article_content)
        user_like_articles.appendChild(user_article)
    })

    // 팔로우 보기
    const follows = document.getElementById("follows")
    response_json["가입정보"]["followings"].forEach(follow => {
        const user_follow = document.createElement("p")
        const user_follow_a = document.createElement("a")
        user_follow_a.setAttribute("id", follow['id'])
        user_follow_a.setAttribute("href", `../users/profile.html?id=${follow['id']}`)
        user_follow_a.innerText = follow['email']
        user_follow.appendChild(user_follow_a)
        follows.appendChild(user_follow)
    })

    // 프로필 유저와 로그인 유저가 같으면 수정하기 버튼 노출
    if (user_id===profile_id) {
        const profile_edit_btn = document.getElementById("profile_edit_btn")
        profile_edit_btn.setAttribute("style", "display:block")

        const profile_edit_page = document.getElementById("profile_edit_page")
        profile_edit_page.setAttribute("href", `../users/profile_edit.html`)
    }

    // 팔로우 버튼을 위한 시작
    const response_user = await fetch('http://127.0.0.1:8000/users/profile/'+user_id+'/', {
        method:"GET"
    })
    response_user_json = await response_user.json()
    console.log(response_user_json["가입정보"]["followings"])

    var user_followings = []
    response_user_json["가입정보"]["followings"].forEach(user => {
        user_followings.push(user["id"])
    })
    console.log(user_followings)
    
    if (user_followings.includes(Number(profile_id))) {
        const follow_button = document.getElementById("follow_button")
        follow_button.innerText = "팔로우 취소"
        console.log("팔로우 취소")
    }
    else {
        const follow_button = document.getElementById("follow_button")
        follow_button.innerText = "팔로우"
        console.log("팔로우")
    }
}

// 마이페이지 이동
async function myPage() {
    const user = localStorage.getItem("payload")
    const user_id = user.split(':')[5].slice(0, -1);
    
    location.href = `../users/profile.html?id=${user_id}`
}

// ajax를 이용한 팔로우 기능 추가
function userFollow() {
    const urlParams = new URL(location.href).searchParams;
    const profile_id = urlParams.get('id');
    const follow_button = document.getElementById("follow_button")

    $.ajax({
        url : 'http://127.0.0.1:8000/users/follow/'+profile_id+'/',
        type : "POST",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
        },
        success: function(data){
            if(data === "follow") {
                follow_button.innerText = "팔로우 취소"
                console.log(data)
            }
            else {
                follow_button.innerText = "팔로우"
                console.log(data)
            }
        }
    })
}

//수정하기 기능
async function profileEdit() {
    const user = localStorage.getItem("payload")
    const user_id = user.split(':')[5].slice(0, -1);

    const response = await fetch('http://127.0.0.1:8000/users/profile/'+user_id+'/', {
        method:"GET"
    })
    response_json = await response.json()
    console.log(response_json)

    const profile_keyword = document.getElementById("profile_keyword").value;
    
    const response_edit = await fetch('http://127.0.0.1:8000/users/profile/'+user_id+'/', {
        headers:{
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type':'application/json',
        },
        method:"PUT",
        body: JSON.stringify({
            "email":response_json["가입정보"]["email"],
            "password":response_json["가입정보"]["password"],
            "profile_image":profile_keyword
        })
    })
    location.href = `../users/profile.html?id=${user_id}`
}