User::create([
    'name'=>'Admin',
    'email'=>'admin@email.com',
    'password'=>bcrypt('admin123'),
    'is_admin'=>true
]);
User::factory(5)->create();
