import axios from "axios";

export const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    return response.data.members;
  } catch (error) {
    console.log("failed to fetch data");
  }
};
