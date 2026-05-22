package types

import (
	"database/sql/driver"
	"errors"
	"fmt"
	"strings"
	"github.com/google/uuid"
)

type UUIDArray []uuid.UUID

func (a *UUIDArray) Scan(value interface{}) error {
	//{123123asdaa,aklsjdla,123123124}
	var str string

	switch v := value.(type) {
	case []byte :
		str = string(v)
	case string :
		str = v
	default:
		return errors.New("Failed to parse UUIDArray: unsupported data type")
	}

	str = strings.TrimPrefix(str,"{")
	str = strings.TrimSuffix(str,"}")
	parts := strings.Split(str,",")


	// make([]T,length,capacity)
	*a = make(UUIDArray,0,len(parts))
	for _ ,s := range parts {
		s = strings.TrimSpace(strings.Trim(s,`"`)) // Akan menghapus spasi dan "
		if s == "" {
			continue
		}
		u, err := uuid.Parse(s)
		if err != nil {
			return fmt.Errorf("Invalid UUID in Array : %v", err)
		}
		*a = append(*a, u)
	}
	return nil;
} 

//{"123ek24-123r-1232-12312-831794138","1231234t-124e-1298-124j123j12"}
func (a UUIDArray) Value()(driver.Value, error) {
	if len(a) == 0 {
		return "{}",nil
	}

	postgreFormat := make([]string, 0, len(a))
	for _ , value:= range a {
		postgreFormat = append(postgreFormat, fmt.Sprintf("%s", value.String()))
	}
	return "{" + strings.Join(postgreFormat, ",") + "}", nil
}

func (UUIDArray) GormDataType() string {
	return "uuid[]"
}