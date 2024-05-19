import React, { useState, useEffect } from 'react';
import coffeeBg from '../../assets/coffee-bg-profile.png';
import photoProfile from '../../assets/photo-profile.png';
import editProfile from '../../assets/edit-profile.png';
import axios from 'axios';

function Profile() {
  const userId = '6b0cd634-c4bd-4c50-822d-6b818c92794e';

  const [data, setData] = useState({});
  const [formattedDate, setFormattedDate] = useState('');
  const [photoInputKey, setPhotoInputKey] = useState(Date.now()); // to reset file input
  const [isLoading, setIsLoading] = useState(false);

  const formatDateToDDMMYY = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const urlToFile = async (url, filename, mimeType) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/user/profile/${userId}`, {
          baseURL: 'http://localhost:8081',
        });
        const data = response.data.data;

        // Format Date to DD/MM/YY
        if (data.birthday) {
          const formattedBirthday = formatDateToDDMMYY(data.birthday);
          setData({ ...data, birthday: formattedBirthday });
          setFormattedDate(formattedBirthday);
        }

        // URL Photo to File
        if (data.photo_profile) {
          const photoFile = await urlToFile(data.photo_profile, 'photo_profile.png', 'image/png');
          setData({ ...data, photo_profile: photoFile });
        }
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  // Formatted Date DD/MM/YY
  const handleFormattedDate = (e) => {
    const date = new Date(e.target.value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    setFormattedDate(`${day}/${month}/${year}`);
  };

  // File Handler
  const fileHandler = (e) => {
    const newData = { ...data, [e.target.name]: e.target.files[0] };
    setData(newData);
  };

  // Handle Change
  const handleChange = (e) => {
    const newData = { ...data, [e.target.name]: e.target.value };
    setData(newData);
  };

  // Handle Remove Photo
  const handleRemovePhoto = () => {
    const newData = { ...data, photo_profile: photoProfile };
    setData(newData);
    setPhotoInputKey(Date.now()); // reset the file input
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    console.log(data);
    e.preventDefault();
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    try {
      setIsLoading(true);
      const response = await axios.post(`/user/profile/${userId}`, formData, {
        baseURL: 'http://localhost:8081',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsLoading(false);
      alert('Profile updated successfully!');
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      alert('Profile updated successfully!');
      window.location.reload();
    }
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <main
      className="min-w-screen min-h-screen bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: `url(${coffeeBg})` }}
    >
      <div className="flex w-[1133px] h-[951px] bg-[#F8F8F8] rounded-[20px] px-[45px] py-[54px] font-poppins">
        {/* Photo and Password */}
        <div className="flex-col w-[315px] px-[54px] text-center">
          <div
            className="w-[175px] h-[175px] rounded-full bg-cover bg-center bg-no-repeat mx-auto"
            style={{
              backgroundImage: `url(${data.photo_profile && data.photo_profile instanceof File ? URL.createObjectURL(data.photo_profile) : photoProfile})`,
            }}
          >
            <input
              key={photoInputKey} // reset input field
              className="w-[175px] h-[175px] rounded-full opacity-0"
              name="photo_profile"
              type="file"
              onChange={fileHandler}
            />
          </div>
          <div className="flex-col w-[207px] text-rubik break-words my-[17px]">
            <div className="font-bold text-[20px] truncate">{data.display_name}</div>
            <div className="text-[15px] truncate">{data.email}</div>
          </div>
          <button className="w-[207px] h-[44px] bg-[#FFBA33] text-[#6A4029] font-bold rounded-[10px] text-[15px] mb-[11px]">
            <input key={photoInputKey} name="photo_profile" className="opacity-0" type="file" onChange={fileHandler} />
            <div className="mt-[-28px]">Choose photo</div>
          </button>
          <button
            className="w-[207px] h-[44px] bg-[#6A4029] text-white font-bold rounded-[10px] text-[15px]"
            onClick={handleRemovePhoto}
          >
            Remove photo
          </button>
          <button className="w-[207px] h-[60px] bg-white text-[#6A4029] font-bold rounded-[20px] border-[1px] border-[#9F9F9F] text-[18px] mt-[42px] mb-[34px]">
            Edit Password
          </button>
          <div className="w-[207px] h-[60px] text-[#6A4029] font-bold text-[20px]">Do you want to save the change?</div>
          <button
            className="w-[207px] h-[60px] bg-[#6A4029] text-white font-bold rounded-[20px] text-[18px] shadow-xl mt-[37px] mb-[22px]"
            onClick={handleSubmit}
          >
            Save Change
          </button>
          <button
            className="w-[207px] h-[60px] bg-[#FFBA33] text-[#6A4029] font-bold rounded-[20px] text-[18px] mb-[49px]"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
          <button className="w-[207px] h-[60px] bg-white text-[#6A4029] font-bold rounded-[20px] border-[1px] border-[#9F9F9F] text-[18px]">
            Log Out
          </button>
        </div>

        <div className="w-[705px] h-[841px] bg-white rounded-[10px] text-poppins ml-[33px] border-b-[12px] border-[#6A4029] px-[30px] py-[17px] shadow-2xl relative">
          <img className="absolute right-5" src={editProfile} alt="Edit profile" />
          {/* Contacts */}
          <div className="font-bold text-[#4F5665] text-[25px] mb-[21px]">Contacts</div>
          <div className="flex">
            <div className="mr-[63px]">
              <div className="mb-[48px]">
                <div className="font-medium text-[20px] text-[#9F9F9F]">Email address:</div>
                <input
                  name="email"
                  type="text"
                  value={data.email}
                  className="w-[340px] h-[42px] border-black border-b-[1px] outline-none text-[20px] font-rubik"
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="font-medium text-[20px] text-[#9F9F9F]">Delivery address:</div>
                <textarea
                  name="address"
                  type="text"
                  value={data.address}
                  className="w-[340px] h-[66px] border-black border-b-[1px] outline-none text-[20px] font-rubik"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <div className="font-medium text-[20px] text-[#9F9F9F]">Phone number:</div>
              <input
                name="phone_number"
                type="text"
                value={data.phone_number}
                className="w-[201px] h-[42px] border-black border-b-[1px] outline-none text-[20px] font-rubik"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Details */}
          <div className="font-bold text-[#4F5665] text-[25px] mb-[21px] mt-[41px]">Details</div>
          <div className="flex">
            <div className="mr-[63px]">
              <div className="mb-[25px]">
                <div className="font-medium text-[20px] text-[#9F9F9F]">Display name:</div>
                <input
                  name="display_name"
                  type="text"
                  value={data.display_name}
                  className="w-[340px] h-[42px] border-black border-b-[1px] outline-none text-[20px] font-rubik"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-[25px]">
                <div className="font-medium text-[20px] text-[#9F9F9F]">First name:</div>
                <input
                  name="first_name"
                  type="text"
                  value={data.first_name}
                  className="w-[340px] h-[42px] border-black border-b-[1px] outline-none text-[20px] font-rubik"
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="font-medium text-[20px] text-[#9F9F9F]">Last name:</div>
                <input
                  name="last_name"
                  type="text"
                  value={data.last_name}
                  className="w-[340px] h-[42px] border-black border-b-[1px] outline-none text-[20px] font-rubik"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <div className="font-medium text-[20px] text-[#9F9F9F]">DD/MM/YY:</div>
              <input
                name="birthday"
                type="date"
                value={data.birthday}
                className="w-[201px] h-[42px] border-black border-b-[1px] outline-none text-[20px] text-transparent font-rubik"
                onChange={(e) => {
                  handleChange(e);
                  handleFormattedDate(e);
                }}
              />
              {<div className="mt-[-35px] text-[20px] text-black cursor-pointer">{formattedDate}</div>}
            </div>
          </div>

          {/* Male or Female */}
          <div className="flex mt-[65px] mb-[70px] justify-center">
            <label className="flex">
              <input
                type="radio"
                name="gender"
                value="male"
                className="hidden peer"
                onChange={handleChange}
                checked={data.gender === 'male'}
              />
              <div className="size-[30px] border-4 border-[#9F9F9F] rounded-full peer-checked:border-[#6A4029] peer-checked:bg-[#FFBA33] peer-checked:border-[5px]"></div>
              <span className="text-[20px] text-[#9F9F9F] font-medium ml-[19px] peer-checked:text-[#6A4029] peer-checked:font-bold">
                Male
              </span>
            </label>
            <label className="flex ml-[115px]">
              <input
                type="radio"
                name="gender"
                value="female"
                className="hidden peer"
                onChange={handleChange}
                checked={data.gender === 'female'}
              />
              <div className="size-[30px] border-4 border-[#9F9F9F] rounded-full peer-checked:border-[#6A4029] peer-checked:bg-[#FFBA33] peer-checked:border-[5px]"></div>
              <span className="text-[20px] text-[#9F9F9F] font-medium ml-[19px] peer-checked:text-[#6A4029] peer-checked:font-bold">
                Female
              </span>
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
