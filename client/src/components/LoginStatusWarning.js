import React from 'react';

const LoginStatusWarning = ({ username }) => (
    <div>
        { username === 'Anonymous'
            ? (
                <p>
                    Warning: it seems you are sending messages anonymously.
                    That's fine if it's what you want, but keep in mind that you
                    cannot recover or view your messages if you lose them. If
                    you login, you can view any messages (at least until they
                    explode) that you make while logged in.
                </p>
            )
            : null
        }
    </div>
);

export default LoginStatusWarning;