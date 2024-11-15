const grid = new BasicGrid({
    data: USERS, 
    headers: [
        {key: "id", text: "ID", width: "20%", sortable: true}, 
        {key: "username", text: "Felhasználónév", sortable: true},
        {key: "lastName", text: "Családnév"},
        {key: "firstName", text: "Keresztnév", sortable: true},
        {key: "email", text: "Email"},
        {key: "status", text: "Status", width: "50%", sortable: true}
    ], 
    renderTo: "#grid-container",
    title: "Felhasználók"
});
