module.exports = [
    {
        model: 'User',
        samples: [
            {
                name: 'admin',
                email: 'bachdaonhan@gmail.com',
                password: 'password1',
                userRole: 'admin',
            },
        ],
        fakeCount: 10,
        fakeData: faker => ({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: 'password1',
            userRole: 'editor',
        }),
    },
    {
        model: 'Role',
        samples: [
            {
                roleName: 'admin',
                read: true,
                write: true,
                create: true,
                delete: true,
                change: true,
            },
            {
                roleName: 'editor',
                read: true,
                write: true,
                create: true,
                delete: true,
                change: true,
            },
            {
                roleName: 'guest',
                write: true,
                create: true,
            },
        ],
    },
];
