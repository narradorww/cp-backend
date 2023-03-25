import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div className="user-profile">
      <h2>Perfil do usuário</h2>
      <div className="user-image">
        <img src={user.profilePicture} alt="Foto do perfil" />
      </div>
      <div className="user-details">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
      <div className="user-actions">
        <button>Editar perfil</button>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default UserProfile;
