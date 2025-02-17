const form = document.getElementById("form");
const formControls = document.querySelectorAll("#form .form-control");
const btn = document.getElementById("button");
const alertBox = document.querySelector(".alert");

let alertShow = (status) => {
    const message = status
        ? {
            text: "Success! Message successfully sent.",
            icon: "la-check-circle",
            bgColor: "bg-success-light"
        }
        : {
            text: "Error! Failed to send the message. Please try again later.",
            icon: "la-times-circle",
            bgColor: "bg-danger-light"
        };

    alertBox.innerHTML = `
        <div class="d-flex align-items-center p-3 rounded-1 ${message.bgColor}">
            <i class="las ${message.icon} me-3 fs-1"></i>
            <div>${message.text}</div>
        </div>`;

    alertBox.style.right = "0%";
    btn.disabled = true;

    setTimeout(() => {
        alertBox.style.right = "-100%";
        btn.disabled = false;

        // formControls.forEach(control => {
        //     control.value = "";
        // });

    }, 3000);


};

form.addEventListener("submit", function (event) {
    event.preventDefault();

    btn.value = "Sending...";

    const serviceID = "default_service";
    const templateID = 'template_36rhlq2';
    btn.disabled = true;

    emailjs.sendForm(serviceID, templateID, this).then(
        () => {
            btn.value = "Send Message";
            alertShow(true);
        },
        (err) => {
            btn.value = "Please try again letter";
            setTimeout(() => {
                btn.value = "Send Message";
            }, 2000);
            console.log(JSON.stringify(err));
            alertShow(false);
        }
    );
});

formControls.forEach(control => {
    control.addEventListener("input", () => {
        control.value = control.value.trim();
    });
});