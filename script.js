const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

const hiddenElements=document.querySelectorAll(
".about,.stats,.ai-section,.how-it-works,.why,.services,.industries,.cta"
);

hiddenElements.forEach(el=>{

el.classList.add("hidden");

observer.observe(el);

});

const counters=document.querySelectorAll(".stat h2");

const speed=200;

counters.forEach(counter=>{

const animate=()=>{

const target=counter.innerText.replace("+","").replace("%","");

const count=+counter.innerText.replace("+","").replace("%","");

const increment=target/speed;

if(count<target){

counter.innerText=Math.ceil(count+increment);

setTimeout(animate,10);

}else{

counter.innerText=counter.dataset.target;

}

}

counter.dataset.target=counter.innerText;

counter.innerText="0";

});

const stats=document.querySelector(".stats");

const statObserver=new IntersectionObserver(entries=>{

if(entries[0].isIntersecting){

counters.forEach(counter=>{

const target=counter.dataset.target;

let current=0;

const end=parseInt(target);

const timer=setInterval(()=>{

current+=Math.ceil(end/50);

if(current>=end){

counter.innerHTML=target;

clearInterval(timer);

}else{

counter.innerHTML=current;

}

},30);

});

statObserver.disconnect();

}

});

statObserver.observe(stats);

// -------------------------
// Contact Form (EmailJS)
// -------------------------

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const button = form.querySelector("button");

        button.disabled = true;
        button.innerHTML = "Sending...";

        emailjs.sendForm(
            "service_xc1gcfp",
            "template_0tohqei",
            this
        )

        .then(function () {

            alert("✅ Thank you! Your message has been sent successfully.");

            form.reset();

            button.disabled = false;
            button.innerHTML = "Send Message";

        })

        .catch(function (error) {

            console.error(error);

            alert("❌ Failed to send message.");

            button.disabled = false;
            button.innerHTML = "Send Message";

        });

    });

});