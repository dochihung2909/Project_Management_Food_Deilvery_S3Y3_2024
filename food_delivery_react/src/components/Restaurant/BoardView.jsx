import React, { useEffect, useState } from 'react'
import { formatCurrencyVND } from '../../utils/currency'
import FoodManageCard from '../Cards/FoodManageCard'
import EmployeeManageCard from '../Cards/EmployeeManageCard'
import Dialog from './Dialog'

const BoardView = ({ foods = [], employees = [], selecting }) => {
    useEffect(() => {
        console.log(selecting);
    }, [])



    return (
        <>
            {selecting === 'Foods' ? (
                <div>
                    {foods.map((food, index) => (
                        <FoodManageCard food={food} key={index}
                        // onEdit={() => console.log('edit')}
                        // onDelete={() => console.log('delete')}
                        />
                    ))}
                </div>
            ) : (
                <div>
                    {employees.map((employee, index) => (
                        <EmployeeManageCard employee={employee} key={index}
                        // onEdit={() => handleEditEmployee(employee)}
                        // onDelete={() => handleDeleteEmployee(employee)} 
                        />
                    ))}
                </div>
            )}
        </>
    )
}

export default BoardView