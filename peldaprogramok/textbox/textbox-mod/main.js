console.log("TextBox");

const content = document.querySelector('#content');

textBox.create({
    renderTo: "#content",
    title: "Lorem ipsum",
    subtitle: "Dolor sit amet",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore iste neque, illum sed nam voluptatibus quas?"
});

textBox.create({
    renderTo: content,
    title: "Nulla maiores",
    subtitle: "quo consectetur",
    text: "Nulla maiores quo consectetur voluptatum, delectus doloremque nesciunt repudiandae eum, sint eius veritatis ipsam enim aspernatur."
});

textBox.create({
    renderTo: "#content",
    title: "Dolor itaque",
    subtitle: "Voluptatem sunt",
    text: "Dolor itaque necessitatibus aliquam, eius neque voluptatem sunt nihil, iste, numquam voluptate.."
});


