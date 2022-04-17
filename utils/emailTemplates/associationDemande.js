const getAssociationDemandeHtmlEmailTemplate = ({
  associationName,
  wilaya,
  commun,
  phoneNum,
  email,
  associationId,
  imagesIds,
}) => {
  return `
    <div style="font-family: sans-serif; padding: 50px;">
      <h1 style="margin-bottom: 20px;">New Association just signup to sadaqa :</h1>

      <form action="http://localhost:5000/api/users/activeAssociation" method="POST" target="_blank" >
        <div>
          <h3>Name : </h3><p>             ${associationName}</p>
        </div>
        <div>
          <h3>Id : </h3> <p>             ${associationId}</p>
        </div>
        <div>
          <h3>Wilaya : </h3><p>             ${wilaya}</p>
        </div>
        <div> 
          <h3>Commun : </h3><p>             ${commun}</p>
        </div>
        <div>
          <h3>Email : </h3><p>             ${email}</p>
        </div>
        <div>
          <h3>Phone Number : </h3><p>             ${phoneNum}</p>
        </div>
        <h3>Official Documents : </h3>
        <div style="display: flex; flex-wrap: wrap; height: 200px;" >
          ${imagesIds.map((imageId) => {
            return `
              <img style="width: auto; height: 100%; margin: 10px;" src="https://drive.google.com/uc?export=view&id=${imageId}" />
              `;
          })}
        </div>
            
        <input name="associationId" value="${associationId}" style="display: none;" />
        <input name="adminKey" value="18112002" style="display: none;" />
        <input name="imagesIds" value="${imagesIds}" style="display: none;" />

        <button style="decoration: none; font-size: 20px; padding: 10px 20px; color: white; background-color: rgb(255, 121, 55); border: none; border-radius: 10px; cursor: pointer; margin: 30px 10px;" type="submit">Accept</button>
      </form>
    </div>
  `;
};

module.exports = { getAssociationDemandeHtmlEmailTemplate };
