import React, { use, useState } from "react";

const Users = ({ userPromise }) => {
  const initialUsers = use(userPromise);
  //   console.log(initialUsers);
  const [users, setUsers] = useState(initialUsers);

  const handleAddUser = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    console.log(name, email);
    const newUser = { name, email };
    // console.log("Sending user:", newUser);

    // Save this user data to the server
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("After saving user:", data);
        // alert("User added successfully!");
        // e.target.reset(); // ফর্ম ক্লিয়ার করবে

        //এখানে insertedId হলো MongoDB তে নতুন ইউজারের _id (ObjectId)।
        //তুমি এটা ব্যবহার করছো ক্লায়েন্ট সাইডে (React এ) সেই নতুন ইউজারকে তোমার লোকাল লিস্টে যোগ করার জন্য।

        if (data.insertedId) {
          newUser._id = data.insertedId;
          const newUsers = [...users, newUser];
          setUsers(newUsers);
          alert("User added successfully!");
          e.target.reset(); // ফর্ম ক্লিয়ার করবে
        }
      })
      .catch((error) => {
        console.error("Error saving user:", error);
      });
  };

  const handleDeleteUser = (id) => {
    console.log("delete a user", id);
    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("after delete", data);
        if (data.deletedCount) {
          alert("delete successfully");
          // ডিলিট সফল হলে লোকাল স্টেট থেকে ইউজারটিকে রিমুভ করে ফেলবে
          const remaining = users.filter((user) => user._id !== id);
          setUsers(remaining);
        }
      });
  };

  return (
    <div>
      <h2>Add a New User: {users.length}</h2>
      <form onSubmit={handleAddUser}>
        <input type="text" name="name" placeholder="Enter name" required />
        <br />
        <input type="email" name="email" placeholder="Enter email" required />
        <br />
        <input type="submit" value="Add User" />
      </form>
      <hr />
      <div>
        {users.map((user) => (
          <p key={user._id}>
            Name: {user.name} Email: {user.email}{" "}
            <button onClick={() => handleDeleteUser(user._id)}>X</button>
          </p>
        ))}
      </div>
    </div>
  );
};

export default Users;
