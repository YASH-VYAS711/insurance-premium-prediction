from pydantic import BaseModel, Field, computed_field
from typing import Literal, Annotated
from Backend.config.city_tier import tier_1,tier_2

class UserInput(BaseModel):
    age: Annotated[
        int,
        Field(
            ...,
            gt=0,
            lt=120,
            description="Age of the user in years"
        )
    ]

    weight: Annotated[
        float,
        Field(
            ...,
            gt=0,
            description="Weight of the user in kilograms"
        )
    ]

    height: Annotated[
        float,
        Field(
            ...,
            gt=0,
            lt=2.51,
            description="Height of the user in meters"
        )
    ]

    sex: Annotated[
        Literal["male", "female"],
        Field(
            ...,
            description="Biological sex of the user"
        )
    ]

    smoker: Annotated[
        bool,
        Field(
            ...,
            description="Indicates whether the user is a smoker"
        )
    ]

    city: Annotated[
        str,
        Field(
            ...,
            description="City of residence (e.g., Bengaluru, Mumbai, Jaipur, etc.)"
        )
    ]

    children: Annotated[
        int,
        Field(
            ...,
            ge=0,
            description="Number of dependent children covered under insurance"
        )
    ]

    @computed_field
    @property
    def bmi(self) -> float:
        return round(self.weight / (self.height ** 2),2)
    
    @computed_field
    @property
    def bmi_category(self) -> int:
        if self.bmi < 18.5:
            return 0
        elif self.bmi < 25:
            return 1
        elif self.bmi < 30:
            return 2
        else:
            return 3

    @computed_field
    @property
    def age_group(self) -> int:
        if self.age < 26:
            return 0
        elif self.age < 36:
            return 1
        elif self.age < 46:
            return 2
        elif self.age < 56:
            return 3
        else:
            return 4

    @computed_field
    @property
    def lifestyle_risk(self) -> int:
        if self.smoker and self.bmi >= 30:
            return 2
        elif self.smoker or self.bmi >= 27:
            return 1
        else:
            return 0

    @computed_field
    @property
    def high_risk_smoker_obese(self) -> int:
        return int(self.smoker and self.bmi >= 30)

    @computed_field
    @property
    def family_size(self) -> int:
        return self.children + 1
    
    @computed_field
    @property
    def smoker_str(self) -> str:
        return "yes" if self.smoker else "no"

    @computed_field
    @property
    def city_tier(self) -> int:

        city_normalized = self.city.strip().title()

        if city_normalized in tier_1:
            return 1
        elif city_normalized in tier_2:
            return 2
        else:
            return 3