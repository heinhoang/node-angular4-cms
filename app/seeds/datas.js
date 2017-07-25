module.exports = [
    {
        model: 'User',
        samples: [
            {
                name: 'admin',
                email: 'bachdaonhan@gamil.com',
                password: 'password1',
                userRole: 'admin',
            },
        ],
        fakeCount: 10,
        fakeData: faker => ({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: 'password1',
            userRole: 'admin',
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
            },
        ],
    },
];
