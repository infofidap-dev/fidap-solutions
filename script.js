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

const stats = document.querySelector(".stats");

if (stats) {
    const statObserver = new IntersectionObserver(entries => {

        if (entries[0].isIntersecting) {

            counters.forEach(counter => {

                const target = counter.dataset.target;
                let current = 0;
                const end = parseInt(target);

                const timer = setInterval(() => {

                    current += Math.ceil(end / 50);

                    if (current >= end) {

                        counter.innerHTML = target;
                        clearInterval(timer);

                    } else {

                        counter.innerHTML = current;

                    }

                }, 30);

            });

            statObserver.disconnect();

        }

    });

    statObserver.observe(stats);
}

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form[name='contact']");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const button = form.querySelector("button");

        button.disabled = true;
        button.innerHTML = "Sending...";

        const data = {

            name: form.querySelector("[name='name']").value,
            email: form.querySelector("[name='email']").value,
            phone: form.querySelector("[name='phone']").value,
            company: form.querySelector("[name='company']").value,
            message: form.querySelector("[name='message']").value

        };

        try {

            const response = await fetch("/.netlify/functions/send-email", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });

            if (response.ok) {

                alert("✅ Message sent successfully!");

                form.reset();

            } else {

                const error = await response.text();
                console.error(error);

                alert("❌ Failed to send message.");

            }

        } catch (err) {

    console.error("EMAIL ERROR:", err);

    return {
        statusCode: 500,
        body: JSON.stringify({
            message: err.message,
            stack: err.stack
        })
    };

}

        button.disabled = false;

        button.innerHTML = "Send Message";

    });

});