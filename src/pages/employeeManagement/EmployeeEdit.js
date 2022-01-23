import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { Link, useHistory, useParams } from "react-router-dom";
import { NetworkError } from "../../components/501/NetworkError";
import { GrayButton } from "../../components/button/Index";
import { Container } from "../../components/container/Index";
import { EmployeeForm } from "../../components/form/EmployeeForm";
import { Layout, Main } from "../../components/layout/Index";
import { Loader } from "../../components/loading/Index";
import { Toastify } from "../../components/toastify/Toastify";
import { Requests } from "../../utils/Http/Index";

const EmployeeEdit = () => {
    const history = useHistory()
    const { id } = useParams()
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [shifts, setShifts] = useState([])

    // for fetching shift
    const fetchShifts = useCallback(async () => {
        setLoading(true)
        try {
            const response = await Requests.EmployeeAll.Shift.EmployeeShiftList()
            if (response && response.status === 200) setShifts(response.data.data)
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        fetchShifts()
    }, [id, fetchShifts])

    const fetchCustomers = useCallback(
        async (page) => {
            try {
                const response = await Requests.EmployeeAll.Employee.EmployeeShow(id);
                if (response && response.status === 200) {
                    setLoading(false);
                    setData(response.data.data);
                }
            } catch (error) {
                if (error) {
                    setLoading(false);
                    Toastify.Error(error.message);
                }
            }
        },
        [id]
    );

    useEffect(() => {
        fetchCustomers(1);
    }, [fetchCustomers]);

    const handleEmployeeUpdate = async (data) => {
        setUpdating(true);
        try {
            const response = await Requests.EmployeeAll.Employee.EmployeeUpdate(data, id)
            if (response && response.status === 200) {
                setUpdating(false);
                Toastify.Success("Employee Updated Successfully");
            }
            history.push("/dashboard/employee-management/list");
        } catch (error) {
            if (error) {
                setUpdating(false);
                Toastify.Error('Something Went Wrong');
            }
        }
    };

    return (
        <>
            <Layout
                page="dashboard / employee management / update employee"
                message="Update Employee's credentials of your shop."
                container="container-fluid"
                button={
                    <div className="print-hidden">
                        <Link to="/dashboard/employee-management/list">
                            <GrayButton type="button">
                                <ArrowLeft size={15} />
                                <span style={{ fontSize: 13 }}>BACK</span>
                            </GrayButton>
                        </Link>
                    </div>
                }
            />

            <Main>
                {loading && !Object.keys(data).length ? <Loader /> : null}
                {!loading && !Object.keys(data).length ? <NetworkError message="Network Error." /> : null}
                {!loading && Object.keys(data).length ?
                    <Container.Fluid>
                        <EmployeeForm
                            loading={updating}
                            submit={handleEmployeeUpdate}
                            employeedata={data}
                            create={false}
                            shifts={shifts}
                        />

                    </Container.Fluid> : null}
            </Main>
        </>
    );
};

export default EmployeeEdit;
