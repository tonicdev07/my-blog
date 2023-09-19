import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputGroup from "./inputGroup";

function TableUpdate({ onClose }: any) {
  const [form, setForm] = useState({});
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getStudentDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios({
        method: "Get",
        url: `http://localhost:5000/api/admin/getDekans/${id}`,
      });
      setForm(data);
      setIsLoading(false);
    } catch (err) {
      setErrors(err.response.data);
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getStudentDetails();
  }, [getStudentDetails, id]);

  const formHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .put(`http://localhost:5000/api/admin/updateDekan`, form)
      .then((res) => {
        toast.success(`${res.data.message}`);
        setIsLoading(false);
        /* hide form after save */
        setForm({});
        /* hide errors after save */
        setErrors({});
        navigate("/admin/addDekan");
        window.location.reload();
      })
      .catch((err) => setErrors(err.response.data));
  };

  useEffect(() => {
    if (errors.length !== 0) {
      setIsLoading(false);
    }
  }, [errors]);
  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "calc(100vh - 60px)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <form noValidate onSubmit={formHandler}>
        {!isLoading && (
          <Box
            sx={{
              maxWidth: 500,
              display: "flex",
              mt: 3,
              alignItems: "center",
              textAlign: "center",
              alignContent: "center",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
            }}
          >
            <InputGroup
              label={t("full_name")}
              type="text"
              name="name"
              onChangeHandler={onChangeHandler}
              errors={errors.name}
              value={form.name}
            />

            <InputGroup
              label={t("academic_year")}
              type="text"
              name="batch"
              onChangeHandler={onChangeHandler}
              errors={errors.joiningYear}
              value={form.joiningYear}
            />
            <FormControl sx={{ width: 130 }}>
              <InputLabel id="demo-simple-select-label">
                {form.gender}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                name="gender"
                onChange={onChangeHandler}
              >
                <MenuItem value="Male">{t("male")}</MenuItem>
                <MenuItem value="Female">{t("female")}</MenuItem>
              </Select>
              <FormHelperText sx={{ color: "red" }}>
                {errors.gender}
              </FormHelperText>
            </FormControl>
            <InputGroup
              label='nom'
              type="number"
              name="firstNumber"
              onChangeHandler={onChangeHandler}
              errors={errors.firstNumber}
              value={form.firstNumber}
            />
            <InputGroup
              label='nom'
              type="number"
              name="secontNumber"
              onChangeHandler={onChangeHandler}
              errors={errors.secontNumber}
              value={form.secontNumber}
            />

            <div className="col-md-6">
              <div className="row justify-content-center text-center">
                <div className="">
                  {isLoading && (
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only"></span>
                    </div>
                  )}
                  {!isLoading && (
                    <>
                      <Button onClick={onClose}>Bekor qilish</Button>
                      <button type="submit" className="btn btn-info  ">
                       Yangilash
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Box>
        )}
      </form>
    </>
  );
}

export default TableUpdate;
